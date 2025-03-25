import { authenticate } from "@/lib/middleware/auth";
import { CreateTransaction } from "@/lib/payu.config";
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

    const body = await req.json();

    const requiredFields = ["amount", "orderNo", "email", "mobile", "firstName"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ ok: false, error: `Missing required field: ${field}` });
      }
    }

    // @ts-ignore
    const { firstName, email, mobile, amount, orderNo } = body;

    const data = await CreateTransaction({
      productinfo: `${orderNo}, ${authCheck.user?.userId}`,
      firstname: firstName,
      email,
      mobile,
      amount: parseInt(amount),
      orderNo: orderNo,
    });

    return new Response(data, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Something went wrong" });
  }
}
