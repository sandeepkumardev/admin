"use server";

import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const obj = {
    id: true,
    name: true,
    slug: true,
    price: true,
    mrp: true,
    images: { take: 2, select: { url: true } },
    colors: true,
    sizes: true,
    category: { select: { name: true, slug: true, parent: { select: { name: true, slug: true } } } },
    ProductReviews: { select: { rating: true } },
  };

  const shopByCategoryObj = {
    id: true,
    name: true,
    slug: true,
    children: {
      where: {
        products: { some: {} },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        products: {
          select: {
            images: {
              take: 1,
            },
          },
          take: 1,
        },
      },
    },
  };

  try {
    let data;

    const start = Date.now();
    if ("table-data" in searchParams) {
      data = await prisma.product.findMany({ include: { category: { include: { parent: true } }, sizes: true } });
    } else if ("new-arrivals" in searchParams) {
      data = await prisma.product.findMany({ where: { isNewArrival: true }, select: obj });
    } else if ("best-sellers" in searchParams) {
      data = await prisma.product.findMany({ where: { isBestSeller: true }, select: obj });
    } else if ("group-data" in searchParams) {
      data = await prisma.product.findMany({ select: { id: true, name: true, slug: true } });
    } else if ("shop-by-category" in searchParams) {
      data = await prisma.category.findMany({
        where: { parentId: null, children: { some: {} } },
        select: shopByCategoryObj,
      });
    } else {
      data = await prisma.product.findMany({
        include: { category: { include: { parent: true } }, colors: true, images: true, attributes: true, sizes: true },
      });
    }
    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Products - Database query time: ${duration} ms`);

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
