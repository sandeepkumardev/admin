import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Orders api called!");
    const orders = await prisma.order.findMany({
      include: { items: { select: { quantity: true, product: { select: { id: true, name: true, slug: true } } } } },
    });
    // console.log(orders.map((o) => ({ id: o.id, userId: o.userId, items: o.items.map((i) => i.product.id) })));
    return NextResponse.json({ ok: true, data: orders });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "something went wrong!" });
  }
}
