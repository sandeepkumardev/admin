import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Filters api called!");
    const attributes = await prisma.attribute.findMany();
    const sizes = await prisma.size.findMany();
    const colors = await prisma.color.findMany();

    const response = NextResponse.json({
      ok: true,
      data: { attributes, sizes, colors },
    });
    return response;
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
