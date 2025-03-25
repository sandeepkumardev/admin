import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Attribures api called!");
    const attributes = await prisma.attribute.findMany();

    const response = NextResponse.json({
      ok: true,
      data: attributes,
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
