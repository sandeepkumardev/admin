import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const { slug } = params;

  try {
    const start = Date.now();
    const data = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } } },
        colors: true,
        images: true,
        attributes: true,
        sizes: true,
        warehouses: { select: { id: true, warehouse: { select: { pincode: true } } } },
        ProductReviews: { include: { user: { select: { name: true } } } },
      },
    });
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Product [id] - Database query time: ${duration} ms`);

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
