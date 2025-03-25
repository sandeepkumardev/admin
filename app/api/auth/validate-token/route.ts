import { generateTokens, verifyToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { access, refresh } = await req.json();
  // Check for missing tokens
  if (!access || !refresh) {
    return NextResponse.json({
      ok: false,
      error: "Both access and refresh tokens are required",
    });
  }

  // Validate access token
  const resAccess = await verifyToken(access, "ACCESS");
  if (resAccess.ok && resAccess.data?.userId) {
    // Access token is valid
    return NextResponse.json({
      ok: true,
      data: {
        accessToken: access,
        refreshToken: refresh,
      },
    });
  }

  // Validate refresh token
  const resRefresh = await verifyToken(refresh, "REFRESH");
  if (resRefresh.ok && resRefresh.data?.userId) {
    // Generate new tokens if refresh token is valid
    const { accessToken, refreshToken } = generateTokens({
      id: resRefresh.data.userId,
    });

    return NextResponse.json({
      ok: true,
      data: { accessToken, refreshToken },
    });
  }

  // If both tokens are invalid
  return NextResponse.json({
    ok: false,
    error: "Session expired. Please login again.",
  });
}
