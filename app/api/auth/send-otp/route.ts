import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/otp";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({
      ok: false,
      error: "Phone is required",
    });
  }

  const otp = await generateOTP();
  const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const userOTP = await prisma.oTP.upsert({
    where: { phone },
    update: { otp, expireAt },
    create: { phone, otp, expireAt },
  });

  if (!userOTP) {
    return NextResponse.json({
      ok: false,
      error: "Something went wrong",
    });
  }

  // In a production environment, you would send the OTP via SMS here
  // For now, we'll just return it in the response for development purposes

  return NextResponse.json({
    ok: true,
    message: "OTP sent successfully",
    data: {
      otp, // Only for development
    },
  });
}
