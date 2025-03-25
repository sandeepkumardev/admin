import { prisma } from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({
      ok: false,
      error: "Email and verification code are required",
    });
  }

  // Find the verification code
  const verification = await prisma.emailVerification.findUnique({
    where: { email },
  });

  if (!verification) {
    return NextResponse.json({
      ok: false,
      error: "Verification code not found",
    });
  }

  if (verification.expireAt < new Date()) {
    return NextResponse.json({
      ok: false,
      error: "Verification code has expired",
    });
  }

  // await wait(3000);

  if (verification.code !== code) {
    return NextResponse.json({
      ok: false,
      error: "Invalid verification code",
    });
  }

  // Mark as verified
  await prisma.emailVerification.update({
    where: { email },
    data: { verified: true },
  });

  return NextResponse.json({
    ok: true,
    message: "Email verified successfully",
  });
}
