import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";
import { wait } from "@/lib/wait";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      ok: false,
      error: "Email is required",
    });
  }

  // Check if email already exists and is onboarded
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.onBoarded) {
    return NextResponse.json({
      ok: false,
      error: "Email already registered. Please sign in instead.",
    });
  }

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save the verification code
  await prisma.emailVerification.upsert({
    where: { email },
    update: { code: verificationCode, expireAt },
    create: { email, code: verificationCode, expireAt },
  });

  // await wait(3000);

  // Send email with verification code
  await sendEmail({
    to: email,
    subject: "Verify your email for Silkyester",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">Welcome to Silkyester</h1>
          <p style="color: #666; font-size: 16px;">Please verify your email address</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your verification code is:</p>
          <h2 style="font-size: 24px; letter-spacing: 5px; color: #333;">${verificationCode}</h2>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">This code will expire in 10 minutes</p>
        </div>

        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">If you didn't request this code, you can safely ignore this email.</p>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Silkyester. All rights reserved.</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({
    ok: true,
    message: "Verification code sent",
    data: {
      // code: verificationCode, // Only for development
    },
  });
}
