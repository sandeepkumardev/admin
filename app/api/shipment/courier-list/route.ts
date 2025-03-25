import { courierClasses, fetchActiveCouriersFromDB } from "@/lib/shipment";
import { courierListQuerySchema } from "@/lib/validations/courier";
import { ICourier } from "@/types";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Courier list api called!");

    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = courierListQuerySchema.safeParse(params);

    if (!query.success) {
      return NextResponse.json({
        ok: false,
        error: "Invalid request",
        issues: query.error.errors.map((error) => error.path.map((key) => `${key} is required`)).flat(),
      });
    }

    type CourierPlatform = keyof typeof courierClasses;
    const activeCouriers = (await fetchActiveCouriersFromDB()) as CourierPlatform[];

    const courierPromises = activeCouriers.map(async (platform) => {
      const CourierClass = courierClasses[platform];
      return CourierClass ? new CourierClass().getCourierServices(params) : [];
    });

    const results = await Promise.all(courierPromises);
    const courierList: ICourier[] = results.flat();

    const groupedCourierList = courierList.reduce((acc, courier) => {
      const key = courier.is_surface ? "surface" : "air";
      acc[key] = acc[key] || [];
      acc[key].push(courier);
      return acc;
    }, {} as Record<string, ICourier[]>);

    Object.keys(groupedCourierList).forEach((key) =>
      groupedCourierList[key].sort((a, b) => a.courier_charge - b.courier_charge)
    );

    const response = NextResponse.json({ ok: true, total: courierList.length, data: groupedCourierList });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: any) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "something went wrong!" });
  }
}
