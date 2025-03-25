import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { otp, phone } = await req.json();

  if (!otp || !phone) {
    return NextResponse.json({
      ok: false,
      error: "OTP and Phone is required",
    });
  }

  const userOTP = await prisma.oTP.findUnique({ where: { phone } });
  if (!userOTP || userOTP.otp !== otp) {
    return NextResponse.json({
      ok: false,
      error: "Invalid OTP",
    });
  }
  if (userOTP.expireAt < new Date()) {
    return NextResponse.json({
      ok: false,
      error: "OTP Expired",
    });
  }

  const productObj = {
    id: true,
    name: true,
    slug: true,
    price: true,
    mrp: true,
    images: { take: 1, select: { url: true } },
    sizes: true,
  };

  const user = await prisma.user.findUnique({
    where: { phone },
    include: {
      addresses: true,
      orders: true,
      cart: { include: { product: { select: productObj } } },
      wishlist: { include: { product: { select: productObj } } },
    },
  });
  if (!user) {
    return NextResponse.json({
      ok: false,
      error: "Please register first!",
    });
  }

  // generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  await prisma.oTP.delete({ where: { phone } });

  return NextResponse.json({ ok: true, data: { user, accessToken, refreshToken } });
}
