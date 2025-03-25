import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Warehouses api called!");
    const data = await prisma.wareHouse.findMany();

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({
      ok: false,
      error: "something went wrong!",
    });
  }
}
