import { authenticate } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import { courierClasses, fetchActiveCouriersFromDB } from "@/lib/shipment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const authCheck = await authenticate(req);
    // if (!authCheck.ok) {
    //   return NextResponse.json({ ok: false, error: authCheck.message });
    // }

    // if (!authCheck.user?.userId) {
    //   return NextResponse.json({ ok: false, error: "Authentication error" });
    // }

    const body = await req.json();

    if (!body || !body.shipment || !body.courier) {
      return NextResponse.json({ ok: false, error: "Missing body" });
    }

    type CourierPlatform = keyof typeof courierClasses;
    const activeCouriers = (await fetchActiveCouriersFromDB()) as CourierPlatform[];

    const platform = body.courier.platform as CourierPlatform;
    if (!activeCouriers.includes(platform)) {
      return NextResponse.json({ ok: false, error: "Courier service is not active!" });
    }

    const CourierClass = courierClasses[platform];

    const result = await new CourierClass().createShipment(body.shipment, body.courier, platform);

    if (!result || !result.data) {
      console.log(`[CREATE-SHIPMENT - ${platform}] - `, result);
      return NextResponse.json({ ok: false, error: result.error || "Error creating shipment" });
    }

    return NextResponse.json({ ok: true, data: result.data });
  } catch (error) {
    console.log("[CREATE-SHIPMENT] - ", error);
    return NextResponse.json({ ok: false, error: "Error creating shipment" });
  }
}
