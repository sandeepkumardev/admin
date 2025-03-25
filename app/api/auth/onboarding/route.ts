import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/token";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, phone, password, gender, otp } = await req.json();

  if (!name || !gender || !password || (!email && !phone)) {
    return NextResponse.json({
      ok: false,
      error: "Please provide all required fields",
    });
  }

  // Validate email verification if email is provided
  if (email) {
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!emailVerification || !emailVerification.verified) {
      return NextResponse.json({
        ok: false,
        error: "Email not verified",
      });
    }
  }

  // Validate OTP if phone is provided
  // if (phone) {
  //   if (!otp) {
  //     return NextResponse.json({
  //       ok: false,
  //       error: "OTP is required for phone verification",
  //     });
  //   }

  //   const userOTP = await prisma.oTP.findUnique({ where: { phone } });
  //   if (!userOTP || userOTP.otp !== otp) {
  //     return NextResponse.json({
  //       ok: false,
  //       error: "Invalid OTP",
  //     });
  //   }
  //   if (userOTP.expireAt < new Date()) {
  //     return NextResponse.json({
  //       ok: false,
  //       error: "OTP Expired",
  //     });
  //   }
  // }

  // Check if email already exists and is onboarded
  if (email) {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser && existingEmailUser.onBoarded) {
      return NextResponse.json({
        ok: false,
        error: "Email already registered",
      });
    }
  }

  // Check if phone already exists and is onboarded
  if (phone) {
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhoneUser && existingPhoneUser.onBoarded) {
      return NextResponse.json({
        ok: false,
        error: "Phone already registered",
      });
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or update user
  const userData: any = {
    name,
    gender,
    password: hashedPassword,
    onBoarded: true,
  };

  if (email) userData.email = email;
  if (phone) userData.phone = phone;

  // Find existing user by email or phone
  let existingUser = null;
  if (email) {
    existingUser = await prisma.user.findUnique({ where: { email } });
  } else if (phone) {
    existingUser = await prisma.user.findUnique({ where: { phone } });
  }

  // Update or create user
  const updatedUser = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: userData,
      })
    : await prisma.user.create({
        data: userData,
      });

  if (!updatedUser) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
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

  // Get full user data with relations
  const user = await prisma.user.findUnique({
    where: { id: updatedUser.id },
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
      error: "Something went wrong",
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Clean up verification data
  if (email) {
    await prisma.emailVerification.deleteMany({ where: { email } });
  }

  if (phone) {
    await prisma.oTP.deleteMany({ where: { phone } });
  }

  return NextResponse.json({
    ok: true,
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
}
