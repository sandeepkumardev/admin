import { courierClasses, fetchActiveCouriersFromDB } from "@/lib/shipment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.awb || !body.orderNumber || !body.platform) {
      return NextResponse.json({ ok: false, error: "Missing awb" });
    }

    type CourierPlatform = keyof typeof courierClasses;
    const activeCouriers = (await fetchActiveCouriersFromDB()) as CourierPlatform[];

    const platform = body.platform as CourierPlatform;
    if (!activeCouriers.includes(platform)) {
      return NextResponse.json({ ok: false, error: "Courier service is not active!" });
    }

    const CourierClass = courierClasses[platform];

    const result = await new CourierClass().cancelCourier(body.awb, body.orderNumber);

    if (!result || !result.data) {
      console.log([`CANCEL SHIPMENT - ${platform}`], result);
      return NextResponse.json({ ok: false, error: "Failed to cancel shipment" });
    }

    return NextResponse.json({ ok: true, data: result.data });
  } catch (error) {
    console.log(["CANCEL SHIPMENT", error]);
    return NextResponse.json({ ok: false, error: "Failed to cancel shipment" });
  }
}
