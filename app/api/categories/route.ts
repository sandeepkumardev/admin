import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  console.log("fetchApi called - categories");

  try {
    const start = Date.now();
    const data = await prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
    });
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data: data,
    });

    if (searchParams.cache === "no-cache") {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    }

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch categories>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });

    if (searchParams.cache === "no-cache") {
      errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      errorResponse.headers.set("Pragma", "no-cache");
      errorResponse.headers.set("Expires", "0");
    }

    return errorResponse;
  }
}
