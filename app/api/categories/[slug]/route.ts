import { defaultGenders } from "@/constants";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[]> = {};

  Object.keys(obj).forEach((key) => {
    if (key === "category") return (result[key] = obj[key].split("_"));
    let value = obj[key].replace("-", " ");
    result[key] = value.split("_");
  });

  return result;
};

export async function GET(req: NextApiRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url || "");
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const { slug } = params;
  const output = convertObject(searchParams);

  const conditionsArr: any[] = [];

  // Add filters by priority
  if (output.gender && output.gender.length) {
    conditionsArr.push({ genders: { hasSome: output.gender } });
  }

  if (output.category && output.category.length) {
    conditionsArr.push({ productType: { in: output.category } });
  }

  if (output.colors && output.colors.length) {
    conditionsArr.push({ colors: { some: { name: { in: output.colors } } } });
  }

  if (output.sizes && output.sizes.length) {
    conditionsArr.push({ sizes: { some: { key: { in: output.sizes } } } });
  }

  if (output.fit && output.fit.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.fit } } } });
  }

  if (output.sleeve && output.sleeve.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.sleeve } } } });
  }

  if (output.neck && output.neck.length) {
    conditionsArr.push({ attributes: { some: { value: { in: output.neck } } } });
  }

  // filter by category
  const categoryArr: any[] = []; // empty for now

  const childrenObj = {
    parent: { select: { name: true, slug: true } },
    products: {
      where: {
        AND: conditionsArr,
      },
      include: {
        ProductReviews: { select: { rating: true } },
        images: true,
        sizes: true,
        attributes: true,
        colors: true,
        productType: { include: { attributes: true } },
      },
    },
  };

  try {
    const start = Date.now();
    let category;
    let products;
    let productTypes;
    let genders;
    let productSizes;

    // fetch category with subcategories without filters
    const categoryData = await prisma.category.findUnique({
      where: { slug: slug },
      include: {
        children: {
          select: {
            name: true,
            slug: true,
            products: { select: { sizeCategory: true, genders: true, productType: { include: { attributes: true } } } },
          },
        },
        products: { select: { sizeCategory: true, genders: true, productType: { include: { attributes: true } } } },
      },
    });

    // if parent category then fetch products from its subcategories with filters
    if (!categoryData?.parentId) {
      category = await prisma.category.findUnique({
        where: { slug: slug },
        include: { children: { where: { AND: categoryArr }, include: childrenObj } },
      });
      productTypes = [...new Set(categoryData?.children.map((item) => item.products.map((p) => p.productType)).flat())];
      productSizes = [...new Set(categoryData?.children.map((item) => item.products.map((p) => p.sizeCategory)).flat())];
      genders = [...new Set(categoryData?.children?.flatMap((item) => item.products.flatMap((p) => p.genders)) || [])];
    } else {
      // if sub category then fetch products with filters
      category = await prisma.category.findUnique({
        where: { slug: slug },
        include: childrenObj,
      });

      genders = [...new Set(categoryData?.products?.flatMap((item) => item.genders) || [])];
      productSizes = [...new Set(categoryData?.products.map((item) => item.sizeCategory))];
    }

    // If no category, check for collection
    if (!categoryData) {
      category = await prisma.collection.findUnique({
        where: { slug: slug },
      });
      // fetch products with filters
      const productsData = await prisma.collectionProducts.findMany({
        where: { collectionId: category?.id, product: { category: { AND: categoryArr }, AND: conditionsArr } },
        select: {
          product: {
            include: {
              images: true,
              sizes: true,
              attributes: true,
              colors: true,
              category: { select: { name: true, slug: true } },
              productType: { include: { attributes: true } },
              ProductReviews: { select: { rating: true } },
            },
          },
        },
      });
      // fetch sub categories of all products in group category
      const subcategoriesData = await prisma.collectionProducts.findMany({
        where: { collectionId: category?.id },
        select: {
          product: {
            include: { category: { select: { name: true, slug: true } }, productType: { include: { attributes: true } } },
          },
        },
      });
      products = productsData.map((item) => item.product);

      // set unique sub categories
      productTypes = [...new Set(subcategoriesData.map((item) => item.product.productType.name))];

      // set unique product sizes
      productSizes = [...new Set(subcategoriesData.map((item) => item.product.sizeCategory))];

      // set unique genders
      genders = [...new Set(subcategoriesData.map((item) => item.product.genders).flat())];
    }

    const duration = Date.now() - start;
    console.log("\x1b[32m%s\x1b[0m", `Categories [id] - Database query time: ${duration} ms`);

    return NextResponse.json({
      ok: true,
      category: category,
      products: products,
      productTypes: productTypes,
      genders: genders,
      productSizes: productSizes,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}
