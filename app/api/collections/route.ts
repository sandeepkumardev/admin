import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());
  console.log("fetchApi called - collections");

  const isActive = searchParams.active;
  const obj: any = {};
  if (isActive) obj["isActive"] = isActive === "true" ? true : false;

  try {
    const start = Date.now();
    const data = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      where: obj,
    });
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Collections - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data: isActive ? data.filter((collection) => collection._count.products !== 0) || [] : data,
    });

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch collections>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}
