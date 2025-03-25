import { status_options } from "@/constants";
import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { IOrderItem, IProduct } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const orders = await prisma.order.findMany({
    where: { userId: authCheck.user?.userId },
    include: {
      items: { include: { product: { select: { id: true, name: true, slug: true, images: true } } } },
      ProductReviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: orders, orderStatus: status_options });
}

export async function POST(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ ok: false, error: "Missing body" });
  }
  if (!body.items || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ ok: false, error: "Missing items" });
  }

  if (
    !body.userId ||
    !body.deliveryId ||
    !body.status ||
    !body.deliveryCharge === undefined ||
    body.giftWrapCharge === undefined ||
    !body.subTotal ||
    !body.paymentMode
  ) {
    return NextResponse.json({ ok: false, error: "Missing required fields" });
  }

  // check the item quantity is available
  const productIds = body.items.map((item: IOrderItem) => item.id);
  const productSizes = body.items.map((item: IOrderItem) => item.size);
  const productQuantities = await prisma.productSizes.findMany({
    where: {
      productId: {
        in: productIds,
      },
      key: {
        in: productSizes,
      },
    },
    select: { productId: true, quantity: true },
  });

  // Check for missing or insufficient items
  const missingItems = body.items.reduce((acc: { productId: string; availableQuantity: number }[], item: IOrderItem) => {
    const product = productQuantities.find((p) => p.productId === item.id);

    if (!product || item.quantity > product.quantity) {
      acc.push({
        productId: item.id,
        availableQuantity: product ? product.quantity : 0,
      });
    }

    return acc;
  }, []);

  if (missingItems.length > 0) {
    return NextResponse.json({
      ok: false,
      error: "Some items are not available",
      missingItems,
    });
  }

  try {
    const order = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber: body?.orderNumber as string,
          userId: body?.userId as string,
          shippingId: body?.deliveryId as string,
          status: body?.status,
          paymentMode: body?.paymentMode,
          totalAmount: body?.totalAmount as number,
          deliveryCharge: body?.deliveryCharge as number,
          giftWrapCharge: body?.giftWrapCharge as number,
          subTotal: body?.subTotal as number,
        },
      });

      await prisma.orderedItem.createMany({
        data: body?.items?.map((item: IOrderItem) => ({
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: item.price,
          totalPrice: item.totalPrice,
        })),
      });

      await prisma.orderTimeline.createMany({
        data: [
          { orderId: order.id, status: "ORDER_CREATED", date: new Date(), completed: true },
          { orderId: order.id, status: "PROCESSING", completed: body?.status === "PROCESSING" },
          { orderId: order.id, status: "CONFIRMED", completed: false },
          { orderId: order.id, status: "OUT_FOR_PICKUP", completed: false },
          { orderId: order.id, status: "PICKED_UP", completed: false },
          { orderId: order.id, status: "SHIPPED", completed: false },
          { orderId: order.id, status: "IN_TRANSIT", completed: false },
          { orderId: order.id, status: "REACHED_AT_DESTINATION", completed: false },
          { orderId: order.id, status: "OUT_FOR_DELIVERY", completed: false },
          { orderId: order.id, status: "DELIVERED", completed: false },
          { orderId: order.id, status: "PAYMENT_PENDING", completed: body?.status === "PAYMENT_PENDING" },
          { orderId: order.id, status: "PAYMENT_FAILED", completed: false },
          { orderId: order.id, status: "CANCELLED", completed: false },
          { orderId: order.id, status: "FAILED", completed: false },
          { orderId: order.id, status: "RETURN_REQUESTED", completed: false },
          { orderId: order.id, status: "RETURNED", completed: false },
          { orderId: order.id, status: "RETURN_FAILED", completed: false },
          { orderId: order.id, status: "RETURN_CANCELLED", completed: false },
          { orderId: order.id, status: "REFUNDED", completed: false },
        ],
      });

      // reduce stock quantity
      await Promise.all(
        body.items.map(async (item: IOrderItem) => {
          await prisma.productSizes.update({
            where: { key_productId_productColor: { productId: item.id, key: item.size, productColor: item.color } },
            data: { quantity: { decrement: item.quantity } },
          });
        })
      );

      return order;
    });

    // delete cart
    await prisma.cart.deleteMany({ where: { userId: body.userId } });

    return NextResponse.json({ ok: true, data: order });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
