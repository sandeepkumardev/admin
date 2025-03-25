import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const data = await prisma.wareHouse.findUnique({
      where: { id },
      include: {
        products: { include: { product: { select: { id: true, name: true, slug: true } } } },
      },
    });

    if (!data) {
      return NextResponse.json({
        ok: false,
        error: "no warehouse found!",
      });
    }

    const response = NextResponse.json({
      ok: true,
      data: data,
    });

    return response;
  } catch (error: any) {
    const errorResponse = NextResponse.json({
      ok: false,
      error: error.message,
    });
    return errorResponse;
  }
}
