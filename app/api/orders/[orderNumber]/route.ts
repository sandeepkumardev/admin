import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Order {id} api called!");
    const { orderNumber } = params;

    if (!orderNumber) {
      return NextResponse.json({ ok: false, error: "Order number is required!" });
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        items: { include: { product: { select: { name: true, sku: true, slug: true, images: { take: 1 } } } } },
        shippingAddress: true,
        shipment: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: order,
    });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "something went wrong!" });
  }
}
