import { courierClasses, fetchActiveCouriersFromDB } from "@/lib/shipment";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const awb = searchParams.get("awb");
    const pf = searchParams.get("platform");

    if (!awb || !pf) {
      return NextResponse.json({ ok: false, error: "Missing awb or platform" });
    }

    type CourierPlatform = keyof typeof courierClasses;
    const activeCouriers = (await fetchActiveCouriersFromDB()) as CourierPlatform[];

    const platform = pf as CourierPlatform;
    if (!activeCouriers.includes(platform)) {
      return NextResponse.json({ ok: false, error: "Courier service is not active!" });
    }

    const CourierClass = courierClasses[platform as CourierPlatform];

    const result = await new CourierClass().trackCourier(awb);

    if (!result || !result.data) {
      console.log([`TRACK AWB - ${platform}`], result);
      return NextResponse.json({ ok: false, error: "Failed to track awb" });
    }

    return NextResponse.json({ ok: true, data: result.data });
  } catch (error) {
    console.log(["TRACK AWB ERROR"], error);
    return NextResponse.json({ ok: false, error: "Failed to track awb" });
  }
}
