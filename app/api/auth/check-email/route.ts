import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      ok: false,
      error: "Email is required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  return NextResponse.json({
    ok: true,
    exists: !!user && user.onBoarded,
  });
}
