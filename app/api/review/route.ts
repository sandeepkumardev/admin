import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    let body;
    try {
      body = await req.json();
      if (!body) {
        return NextResponse.json({ ok: false, error: "Missing body" });
      }
      if (!body.orderId || !body.productId || !body.rating) {
        return NextResponse.json({ ok: false, error: "Missing required fields" });
      }
    } catch (error) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const reviewData = await prisma.productReviews.create({
      data: {
        userId: authCheck.user?.userId,
        orderId: body.orderId,
        productId: body.productId,
        rating: body.rating,
        comment: body.comment,
        images: body.images || [],
      },
    });
    return NextResponse.json({
      ok: true,
      data: reviewData,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ ok: false, error: "Review already exists" });
    }
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ ok: false, error: "Missing productId" });
    }

    const reviews = await prisma.productReviews.findMany({
      where: { productId, isDeleted: false },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, data: reviews });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: error });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const reviewId = req.nextUrl.searchParams.get("reviewId");
    if (!reviewId) {
      return NextResponse.json({ ok: false, error: "Missing reviewId" });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    const review = await prisma.productReviews.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      return NextResponse.json({ ok: false, error: "Review not found" });
    }
    if (review.userId !== authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "You don't have permission" });
    }

    let updateData: any = {};
    if (body.rating) {
      updateData.rating = body.rating;
    }
    if (body.comment) {
      updateData.comment = body.comment;
    }
    if (body.images) {
      updateData.images = body.images || [];
    }

    const updatedReview = await prisma.productReviews.update({
      where: { id: reviewId },
      data: updateData,
    });
    return NextResponse.json({ ok: true, data: updatedReview });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: error });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authCheck = await authenticate(req);
    if (!authCheck.ok) {
      return NextResponse.json({ ok: false, error: authCheck.message });
    }
    if (!authCheck.user?.userId) {
      return NextResponse.json({ ok: false, error: "Authentication error" });
    }

    const reviewId = req.nextUrl.searchParams.get("reviewId");
    if (!reviewId) {
      return NextResponse.json({ ok: false, error: "Missing reviewId" });
    }

    await prisma.productReviews.delete({ where: { id: reviewId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: error });
  }
}
