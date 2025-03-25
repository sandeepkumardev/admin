import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Colors api called!");
    const colors = await prisma.color.findMany();

    const response = NextResponse.json({
      ok: true,
      data: colors,
    });
    // response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
