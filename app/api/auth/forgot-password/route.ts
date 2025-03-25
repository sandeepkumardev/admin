import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

  if (!user) {
    // Don't reveal that the user doesn't exist for security reasons
    return NextResponse.json({
      ok: true,
      message: "If your email is registered, you will receive a password reset link",
    });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Save the reset token to the database
  await prisma.passwordReset.upsert({
    where: { email },
    update: { token: resetToken, expireAt: resetTokenExpiry },
    create: { email, token: resetToken, expireAt: resetTokenExpiry },
  });

  // Create reset URL
  const resetUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3011"
  }/reset-password?token=${resetToken}&email=${email}`;

  // Send email with better template
  await sendEmail({
    to: email,
    subject: "Reset Your Silkyester Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 10px;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px;">You requested a password reset for your Silkyester account</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          <p style="font-size: 12px; color: #999; margin-top: 15px;">This link will expire in 1 hour</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">If you didn't request this password reset, you can safely ignore this email.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Silkyester. All rights reserved.</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({
    ok: true,
    message: "Password reset link sent to your email",
  });
}
