import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// create
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

  const address = await prisma.address.create({
    data: { ...body, userId: authCheck.user?.userId },
  });

  return NextResponse.json({ ok: true, data: address });
}

export async function PUT(req: NextRequest) {
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

  const id = body.id;
  delete body.id;
  const address = await prisma.address.update({
    where: { id },
    data: { ...body, userId: authCheck.user?.userId },
  });
  return NextResponse.json({ ok: true, data: address });
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

  await prisma.address.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}
