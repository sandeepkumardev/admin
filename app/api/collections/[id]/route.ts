import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// admin api
export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
  console.log("fetchApi called - group category");

  const { id } = params;
  try {
    const start = Date.now();
    const data = await prisma.collection.findUnique({
      where: { id },
    });

    if (!data) {
      return NextResponse.json({
        ok: false,
        error: "no category found!",
      });
    }

    const res = await prisma.collectionProducts.findMany({
      where: { collectionId: data?.id },
      select: { product: { select: { id: true, name: true, slug: true } } },
    });
    const products = res.map((item) => item.product);

    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories - Database query time: ${duration} ms`);

    const response = NextResponse.json({
      ok: true,
      data: { ...data, products },
    });

    return response;
  } catch (error: any) {
    console.error("ERROR:", "<fetch group category>", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}
