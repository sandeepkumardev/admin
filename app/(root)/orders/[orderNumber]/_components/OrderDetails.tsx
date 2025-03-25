"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IOrder, IOrderItem, IWarehouse } from "@/types";
import { Dot, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { CreateShipmentDialog } from "./CreateShipmentDialog";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import TrackShipment from "./TrackShipment";
import SchedulePickup from "./SchedulePickup";

interface IShipment {
  platform: string;
  awb: string;
  pickupDate?: string;
  shipmentId: string;
  orderId?: string;
  orderNumber: string;
}

const OrderDetails = ({ order, pickupLocations }: { order: IOrder; pickupLocations: IWarehouse[] }) => {
  const [shipment, setShipment] = useState<IShipment | null>(null);

  useEffect(() => {
    if (!order.shipment) return;
    if (order.shipment.platform === "shiprocket") {
      setShipment({
        platform: order.shipment.platform,
        awb: order.shipment.response.awb_code,
        shipmentId: order.shipment.response.shipment_id,
        orderId: order.shipment.response.order_id,
        orderNumber: order.orderNumber,
        pickupDate: order.shipment.response.pickup_scheduled_date,
      });
    }
  }, []);

  return (
    <div>
      {!order.cancelledAt ? (
        <div className="flex gap-2 items-center justify-end min-h-8">
          {!shipment?.awb ? (
            <CreateShipmentDialog order={order} pickupLocations={pickupLocations} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <h2 className="font-semibold leading-5">AWB: {shipment.awb}</h2>
                {shipment.pickupDate && <p className="text-xs">Pickup Date: {shipment.pickupDate.slice(0, 16)}</p>}
              </div>
              {!shipment.pickupDate ? (
                <SchedulePickup shipmentId={shipment.shipmentId} platform={shipment.platform} />
              ) : (
                <TrackShipment awb={shipment.awb} platform={shipment.platform} />
              )}
            </div>
          )}
          <Dropdown shipment={shipment} />
        </div>
      ) : (
        <Alert variant="destructive" className="rounded">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Order Cancelled</AlertTitle>
          <AlertDescription>
            This order has been cancelled. Cancelled by <b>{order.cancelledBy}</b>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-2 my-5">
        {order.items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const OrderItem = ({ item }: { item: IOrderItem }) => {
  return (
    <div className="border rounded p-2 flex gap-2">
      <div className="w-[60px] tablet:w-[100px]">
        <AspectRatio ratio={0.8 / 1} className="">
          <Image
            priority
            key={item.product.name}
            src={item.product.images[0].url}
            alt="product"
            className="w-full h-full object-cover rounded"
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
      </div>
      <div className="relative flex-1">
        <p className="text-sm tablet:text-base font-semibold !leading-[15px] line-clamp-2">{item.product.name}</p>

        <div className="absolute bottom-0">
          <p className="text-xs mobile:text-sm font-normal">
            Size: <span className="font-semibold text-sm mobile:text-base">{item.size}</span>
          </p>
          <ColorPalette color={item.color} />
        </div>
      </div>
      <div className="flex flex-col justify-between text-right">
        <p className="text-xs mobile:text-sm font-normal">
          Quantity: <span className="font-semibold text-sm mobile:text-base">{item.quantity}</span>
        </p>
        <div>
          <p className="text-xs mobile:text-sm font-normal">P/U: ₹{item.price}</p>
          <p className="text-xs mobile:text-sm font-normal">
            Total: <span className="font-semibold text-sm mobile:text-base">₹{item.price * item.quantity}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ColorPalette = ({ color }: { color: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-xs mobile:text-sm font-normal">
          Color:{" "}
          <span className={`border px-2 rounded-2xl font-bold`} style={{ color: color, borderColor: color }}>
            {color}
          </span>
        </p>
      </DialogTrigger>
      <DialogContent className="h-96 w-96" style={{ backgroundColor: color }} aria-describedby={undefined}>
        <DialogTitle className="hidden">Color</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
