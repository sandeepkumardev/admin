import { prisma } from "@/lib/prisma";
import _ from "lodash";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// const getProductIDs = async (query: string) => {
//   const regexTerms = query.split(" ").map((term) => ({
//     $or: [{ name: { $regex: term, $options: "i" } }, { description: { $regex: term, $options: "i" } }],
//   }));

//   const matchedProducts = await prisma.product.aggregateRaw({
//     pipeline: [
//       {
//         $match: {
//           $and: [...regexTerms],
//         },
//       },
//       {
//         $project: {
//           _id: {
//             $toString: "$_id",
//           },
//         },
//       },
//     ],
//   });

//   return _.map(matchedProducts, "_id");
// };

const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[] | string> = {};

  Object.keys(obj).forEach((key) => {
    if (key === "q") return (result[key] = obj[key]);
    let value = obj[key].replace("-", " ");
    result[key] = value.split("_");
  });

  return result;
};

const convertFilters = (obj: Record<string, string[] | string>) => {
  const result: any[] = [];

  // Add filters by priority
  if (obj.gender && obj.gender.length) {
    result.push({ genders: { hasSome: obj.gender } });
  }

  if (obj.category && obj.category.length) {
    result.push({ productType: { in: obj.category } });
  }

  if (obj.colors && obj.colors.length) {
    result.push({ colors: { some: { name: { in: obj.colors } } } });
  }

  if (obj.sizes && obj.sizes.length) {
    result.push({ sizes: { some: { key: { in: obj.sizes } } } });
  }

  if (obj.fit && obj.fit.length) {
    result.push({ attributes: { some: { value: { in: obj.fit } } } });
  }

  if (obj.sleeve && obj.sleeve.length) {
    result.push({ attributes: { some: { value: { in: obj.sleeve } } } });
  }

  if (obj.neck && obj.neck.length) {
    result.push({ attributes: { some: { value: { in: obj.neck } } } });
  }
  return result;
};

function preprocessSearchQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/[^\w\s]/g, " ") // Remove special characters
    .split(/\s+/) // Split into terms
    .filter((term) => term.length > 2)
    .map((term) => term + ":*") // Enable prefix matching
    .join(" & "); // AND logic
}

interface ProductResult {
  _id: string;
  // Add other fields you need from the product
}

export async function GET(req: Request) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Search API called");
    const start = Date.now();

    const url = new URL(req.url || "");
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const obj = convertObject(searchParams);

    if (!obj.q || obj.q.length < 2) {
      return NextResponse.json(JSON.stringify([]), { status: 200 });
    }

    const page = parseInt(obj.page ? obj.page[0] : "1"); // Current page
    const limit = parseInt(obj.limit ? obj.limit[0] : "20"); // Items per page
    const offset = (page - 1) * limit; // Calculate offset

    const conditionsArr = convertFilters(obj);
    const processedQuery = preprocessSearchQuery(obj.q as string);

    // const results = await prisma.$queryRaw<{ id: string }[]>`
    //   SELECT
    //     _id, name, description, price,
    //     search_vector::text,  -- Cast tsvector to string
    //     ts_rank(search_vector, to_tsquery('english', ${processedQuery})) AS rank
    //   FROM products
    //   WHERE search_vector @@ to_tsquery('english', ${processedQuery})
    //   ORDER BY rank DESC
    //   LIMIT 20;
    // `;

    const productIds = await prisma.$queryRaw<{ _id: string }[]>`
      SELECT _id
      FROM products
      WHERE search_vector @@ to_tsquery('english', ${processedQuery})
      ORDER BY ts_rank(search_vector, to_tsquery('english', ${processedQuery})) DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
    // search_vector::text AS search_vector // Debugging or logging

    const results = await prisma.product.findMany({
      where: {
        id: { in: productIds.map((p) => p._id) },
        AND: conditionsArr,
      },
      include: {
        images: true,
        sizes: true,
        attributes: true,
        colors: true,
        category: { select: { name: true, slug: true } },
        productType: { include: { attributes: true } },
      },
      orderBy: {
        // Maintain search ranking order
        id: "asc", // This will preserve the order from the raw query
      },
    });

    // const productIds = await getProductIDs(searchParams.q);
    // const results = await prisma.product.findMany({
    //   where: {
    //     OR: [
    //       { name: { contains: obj.q as string, mode: "insensitive" } },
    //       { category: { name: { contains: obj.q as string, mode: "insensitive" } } },
    //       { productType: { name: { contains: obj.q as string, mode: "insensitive" } } },
    //     ],
    //   },
    //   select: {
    //     name: true,
    //     category: { select: { name: true } },
    //     productType: { select: { name: true } },
    //     // images: { take: 1 }, // Show first image
    //   },
    //   take: 20, // Limit results
    // });

    return NextResponse.json({
      ok: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.length,
        totalPages: Math.ceil(results.length / limit),
      },
    });

    // const result = await prisma.product.findMany({
    //   where: {
    //     id: { in: productIds },
    //     AND: conditionsArr,
    //   },
    //   include: {
    //     images: true,
    //     sizes: true,
    //     attributes: true,
    //     colors: true,
    //     category: { select: { name: true, slug: true } },
    //     productType: { include: { attributes: true } },
    //   },
    // });

    // const duration = Date.now() - start;
    // console.log("\x1b[32m%s\x1b[0m", `Search - Database query time: ${duration} ms`);

    // // set unique sub categories
    // const productTypes = [...new Set(result.map((item) => item.productType.name))];

    // // set unique product sizes
    // const productSizes = [...new Set(result.map((item) => item.sizeCategory))];

    // // set unique genders
    // const genders = [...new Set(result.map((item) => item.genders).flat())];

    // return NextResponse.json({
    //   ok: true,
    //   count: result.length,
    //   products: result,
    //   productTypes,
    //   productSizes,
    //   genders,
    // });
  } catch (error: any) {
    console.error("Search failed:", error);
    return new Response(JSON.stringify({ error: "Search service unavailable" }), {
      status: 500,
    });
  }
}

// Create a text index on 'name' and 'description'
// await collection.createIndex({ name: "text", description: "text" });

// const result = await prisma.product.findRaw({
//   filter: {
//     $text: { $search: query },
//     genders: { $in: ["Male", "Unisex"] },
//   },
// });
