import { courierClasses, fetchActiveCouriersFromDB } from "@/lib/shipment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.date || !body.shipmentId || !body.platform || !body.orderNumber) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    type CourierPlatform = keyof typeof courierClasses;
    const activeCouriers = (await fetchActiveCouriersFromDB()) as CourierPlatform[];

    const platform = body.platform as CourierPlatform;
    if (!activeCouriers.includes(platform)) {
      return NextResponse.json({ ok: false, error: "Courier service is not active!" });
    }

    const CourierClass = courierClasses[platform];

    const result = await new CourierClass().schedulePickup(body.date, body.shipmentId, body.orderNumber);

    if (!result || !result.data) {
      // console.log([`SCHEDULE ORDER - ${platform}`], result);
      return NextResponse.json({ ok: false, error: result.error || "Failed to schedule pickup" });
    }

    return NextResponse.json({ ok: true, data: result.data, message: result.message });
  } catch (error) {
    console.log(["SCHEDULE ORDER", error]);
    return NextResponse.json({ ok: false, error: "Failed to schedule pickup" });
  }
}
