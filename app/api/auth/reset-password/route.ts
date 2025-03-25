import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, email, password } = await req.json();

  if (!token || !email || !password) {
    return NextResponse.json({
      ok: false,
      error: "Token, email, and password are required",
    });
  }

  // Find the reset token
  const resetToken = await prisma.passwordReset.findFirst({
    where: {
      email,
      token,
      expireAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) {
    return NextResponse.json({
      ok: false,
      error: "Invalid or expired token",
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // Delete the reset token
  await prisma.passwordReset.delete({
    where: { email },
  });

  return NextResponse.json({
    ok: true,
    message: "Password reset successful",
  });
}
