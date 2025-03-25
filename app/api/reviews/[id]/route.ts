import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const reviews = await prisma.productReviews.findMany({
      where: { productId: id, isDeleted: false },
      include: { user: { select: { name: true } }, product: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (!reviews) {
      return NextResponse.json({
        ok: false,
        error: "no reviews found!",
      });
    }

    const response = NextResponse.json({
      ok: true,
      data: reviews,
    });

    return response;
  } catch (error: any) {
    console.log("error -", error);
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}
