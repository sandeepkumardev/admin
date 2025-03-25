import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { formatStatusLabel } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const body = await req.json();
  if (!body || !body.orderNo || !body.status) {
    return NextResponse.json({ ok: false, error: "Missing body" });
  }

  const validStatus = formatStatusLabel(body.status);
  if (!validStatus) {
    return NextResponse.json({ ok: false, error: "Invalid status" });
  }

  const order = await prisma.order.update({
    where: { orderNumber: body.orderNo },
    data: { status: body.status },
  });

  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" });
  }

  await prisma.orderTimeline.upsert({
    where: { orderId_status: { orderId: order.id, status: body.status } },
    update: { status: body.status, completed: true },
    create: { orderId: order.id, status: body.status, completed: true },
  });

  return NextResponse.json({ ok: true, data: order });
}
