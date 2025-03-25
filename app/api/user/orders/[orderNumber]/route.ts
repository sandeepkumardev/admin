import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import processTimeline from "./processTimeline";

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    console.log("\x1b[32m%s\x1b[0m", "Order {id} api called!");
    const { orderNumber } = params;

    if (!orderNumber) {
      return NextResponse.json({ ok: false, error: "Order number is required!" });
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        items: { include: { product: { select: { name: true, sku: true, slug: true, images: { take: 1 } } } } },
        shippingAddress: true,
        shipment: true,
        timeline: true,
      },
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found!" });
    }

    let timeline: any = [];
    if (order.shipment?.awbNumber) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shipment/track?awb=${order.shipment.awbNumber}&platform=${order.shipment?.platform}`,
        { cache: "no-cache" }
      );
      const data = await response.json();

      if (data.ok && data.data) {
        timeline = data.data.shipment_track_activities;
      } else {
        console.log("error -", data);
      }
    }

    // const timeline = processTimeline(order.timeline, order.paymentMode, order.paymentId);

    // Example Usage
    const filteredTimeline = filterTrackingData(timeline);
    console.log(filteredTimeline);

    return NextResponse.json({
      ok: true,
      data: { ...order, timeline: filteredTimeline },
    });
  } catch (error) {
    console.log("error -", error);
    return NextResponse.json({ ok: false, error: "something went wrong!" });
  }
}

function filterTrackingData(trackingData) {
  // Define important statuses
  const importantStatuses = [
    "DELIVERED",
    "OUT FOR DELIVERY",
    "REACHED AT DESTINATION HUB",
    "IN TRANSIT",
    "PICKED UP",
    "SHIPPED",
  ];

  // Filter data based on important statuses
  const filteredData = trackingData.filter((item) => importantStatuses.includes(item["sr-status-label"]));

  // Sort by date (latest first)
  return filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
}
