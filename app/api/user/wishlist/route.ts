import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const body = await req.json();
  if (!body || !body.item) {
    return NextResponse.json({ ok: false, error: "Missing body" });
  }

  const item = await prisma.wishList.create({
    data: { ...body.item, userId: authCheck.user?.userId },
  });

  return NextResponse.json({ ok: true, data: item });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await authenticate(req);
  if (!authCheck.ok) {
    return NextResponse.json({ ok: false, error: authCheck.message });
  }
  if (!authCheck.user?.userId) {
    return NextResponse.json({ ok: false, error: "Authentication error" });
  }

  const body = await req.json();
  if (!body || !body.id) {
    return NextResponse.json({ ok: false, error: "Missing body" });
  }

  const item = await prisma.wishList.delete({ where: { id: body.id } });

  return NextResponse.json({ ok: true, data: item });
}
