import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.formData();
  const payuData = Object.fromEntries(body.entries());

  // const params = new URLSearchParams(window.location.search);
  // console.log({ params });

  // // Your PayU merchant key & salt
  // const merchantKey = process.env.PAYU_MERCHANT_KEY!;
  // const merchantSalt = process.env.PAYU_MERCHANT_SALT!;
  const url = process.env.NODE_ENV === "development" ? "http://localhost:3011" : "https://silkyester.com";

  if (!payuData.hash || !payuData.status || !payuData.txnid) {
    console.log("❌ Invalid Response from PayU");
    return NextResponse.redirect(`${url}/order/failure`);
  }

  if (payuData.status === "success") {
    console.log("✅ Payment Success:", payuData);
    const productInfo = payuData.productinfo as string;
    console.log({ productInfo });
    const orderNo = productInfo.split(",")[0].trim();
    // Store transaction in DB & Redirect to client-side success page
    return NextResponse.redirect(`${url}/order/success?orderNo=${orderNo}&paymentMode=PayU Payment`);
  }

  console.log("❌ Payment Failed:", payuData);
  return NextResponse.redirect(`${url}/order/failure`);

  // // Generate Hash to verify authenticity
  // const hashString = `${merchantKey}|${payuData.txnid}|${payuData.amount}|${payuData.productinfo}|${payuData.firstname}|${payuData.email}|${payuData.udf1}|${payuData.udf2}|${payuData.udf3}|${payuData.udf4}|${payuData.udf5}||||||${merchantSalt}`;

  // const generatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

  // if (generatedHash === payuData.hash) {
  //   console.log("✅ Payment Verified:", payuData);
  //   // Store transaction in DB & Redirect to client-side success page
  //   return NextResponse.redirect(`${url}/payment-success?txnid=${payuData.txnid}`);
  // } else {
  //   console.log("❌ Hash Mismatch: Payment Failed");
  //   return NextResponse.redirect(`${url}/payment-failure`);
  // }
}
