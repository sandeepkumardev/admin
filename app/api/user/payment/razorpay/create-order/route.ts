import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const body = await req.json();

    if (!body || !body.amount || !body.orderNo) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: body.orderNo },
    });
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found" });
    }

    if (order.userId !== authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" });
    }

    if (order.paymentId) {
      return NextResponse.json({ ok: false, error: "Payment already initiated", paymentId: order.paymentId });
    }

    const options = {
      amount: body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const response = await razorpay.orders.create(options);
    return NextResponse.json({ ok: true, data: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
