import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IOrder, IWarehouse } from "@/types";
import { useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { CheckCheckIcon, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";

export function CreateShipmentDialog({ order, pickupLocations }: { order: IOrder; pickupLocations: IWarehouse[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [w_pincode, setWPincode] = useState("");
  const [d_pincode, setDPincode] = useState(order.shippingAddress.pincode);
  const [weight, setWeight] = useState("500");
  const [s_value, setSValue] = useState(order.subTotal);
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("9");
  const [p_type, setPType] = useState(order.paymentId ? "PREPAID" : "COD");
  const [isLoading, setIsLoading] = useState(false);
  const [courierPartners, setCourierPartners] = useState(null);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  const handleFindCourier = async () => {
    try {
      setIsLoading(true);
      setCourierPartners(null);
      const res = await fetch(
        `/api/shipment/courier-list?p_pin=${w_pincode}&d_pin=${d_pincode}&dm=e&pm=${
          p_type === "PREPAID" ? "pre-paid" : "cod"
        }&sv=${s_value}&w=${weight}&bl=${length}&bw=${width}&bh=${height}`
      ).then((res) => res.json());
      setIsLoading(false);

      if (!res.ok || res.total === 0) {
        toast({ title: "Error finding courier" });
      }

      setCourierPartners(res.data);
    } catch (error) {
      setIsLoading(false);
      console.log("find courier error -", error);
      toast({ title: "Error finding courier" });
    }
  };

  const shipment = useMemo(
    () => ({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      warehouse: {
        id: pickupLocations.find((item) => item.pincode === w_pincode)?.id,
        pincode: w_pincode,
        name: pickupLocations.find((item) => item.pincode === w_pincode)?.warehouseName,
      },
      delivery: {
        name: order.shippingAddress.name,
        address: order.shippingAddress.line1 + ", " + order.shippingAddress.line2 + ", " + order.shippingAddress.landmark,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        pincode: order.shippingAddress.pincode,
        phone: order.shippingAddress.phone,
        email: order.shippingAddress.email,
        residenceType: order.shippingAddress.residenceType,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      payment: {
        mode: order.paymentId ? "PREPAID" : "COD",
        totalAmount: order.totalAmount,
        delivery: order.deliveryCharge,
        giftWrap: order.giftWrapCharge,
        subTotal: order.subTotal,
      },
      box: {
        length: length,
        width: width,
        height: height,
        weight: weight,
      },
    }),
    [w_pincode, length, width, height, weight]
  );

  const handleCreateShipment = async (cp: any) => {
    try {
      setIsCreatingShipment(true);

      const res = await fetch("/api/shipment/create", {
        method: "POST",
        body: JSON.stringify({ shipment, courier: cp }),
      }).then((res) => res.json());
      if (!res.ok) {
        toast({ title: res.error || "Error creating shipment" });
        return;
      }

      setIsCreatingShipment(false);
      setIsOpen(false);
      toast({ title: "Shipment created successfully" });
      window.location.reload();
    } catch (error) {
    } finally {
      setIsCreatingShipment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded" size={"sm"}>
          Create Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Find courier partner</DialogTitle>
          <DialogDescription>Enter shipment details</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="warehouse-pincode">Warehouse *</Label>
              {/* <Input id="warehouse-pincode" value={w_pincode} onChange={(e) => setWPincode(e.target.value)} /> */}
              <Select onValueChange={setWPincode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {_.map(pickupLocations, (item) => (
                    <SelectItem key={item.id} value={item.pincode}>
                      {item.warehouseName} [{item.pincode}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="delivery-pincode">Delivery Pincode</Label>
              <Input id="delivery-pincode" value={order.shippingAddress.pincode} readOnly disabled />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="width">Weight (grams)*</Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter weight in grams"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="value">Shipment Value</Label>
              <Input id="value" value={s_value} readOnly disabled />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="width">Diamensions (LxWxH) in cm*</Label>
              <div className="flex gap-1 items-end">
                <Input id="width" type="number" placeholder="L" value={length} onChange={(e) => setLength(e.target.value)} />
                x
                <Input id="width" type="number" placeholder="W" value={width} onChange={(e) => setWidth(e.target.value)} />
                x
                <Input id="width" type="number" placeholder="H" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="value">Payment Method</Label>
              <RadioGroup defaultValue={order.paymentId ? "PREPAID" : "COD"} disabled>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PREPAID" id="PREPAID" />
                  <Label htmlFor="PREPAID">Prepaid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COD" id="COD" />
                  <Label htmlFor="COD">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleFindCourier}
            disabled={isLoading || !w_pincode || !weight || !length || !width || !height}
            type="submit"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Find Courier"}
          </Button>
        </DialogFooter>

        {courierPartners && (
          <>
            <Separator />
            <div className="">
              <h2 className="text-lg font-semibold">Courier Partners</h2>
              <Tabs defaultValue="surface" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="surface" className="w-full">
                    Surface
                  </TabsTrigger>
                  <TabsTrigger value="air" className="w-full">
                    Air
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="surface">
                  <div className=" max-h-[400px] overflow-y-scroll grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {_.map(courierPartners["surface"], (cp, i) => (
                      <CourierCard
                        key={i}
                        cp={cp}
                        sd={shipment}
                        onSelect={handleCreateShipment}
                        isCreating={isCreatingShipment}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="air">
                  <div className=" max-h-[400px] overflow-y-scroll grid grid-cols-1 tablet:grid-cols-2 gap-2">
                    {_.map(courierPartners["air"], (cp, i) => (
                      <CourierCard
                        key={i}
                        cp={cp}
                        sd={shipment}
                        onSelect={handleCreateShipment}
                        isCreating={isCreatingShipment}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const CourierCard = ({ cp, sd, onSelect, isCreating }: { cp: any; sd: any; onSelect: any; isCreating: boolean }) => {
  return (
    <div className="border rounded p-2 group relative">
      <span className="flex justify-between">
        <h4 className="text-xs font-semibold border rounded-xl px-2 border-purple-600 w-fit">{cp.platform}</h4>
        <h3 className="text-lg h-fit font-bold text-green-500 leading-none">{cp.courier_charge.toFixed(2)}</h3>
      </span>
      <h5 className="text-sm font-semibold mt-1">{cp.courier_name}</h5>
      <div className="mt-2 text-xs grid grid-cols-2 gap-1">
        <span>Time: {cp.deliveryTime || "_"} days</span>
        <span>Zone: {cp.zone}</span>
        <span>Date: {cp.deliveryDate || "_"}</span>
        <span>Mode: {cp.is_surface ? "Surface" : "Air"}</span>
      </div>
      <span className="hidden group-hover:inline absolute bottom-1 right-1 rounded">
        <SelectedCourier cp={cp} sd={sd} onSelect={onSelect} isCreating={isCreating} />
      </span>
    </div>
  );
};

const SelectedCourier = ({ cp, sd, onSelect, isCreating }: { cp: any; sd: any; onSelect: any; isCreating: boolean }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} className="px-2 h-6 rounded border-none">
          Select
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cp.courier_name}</DialogTitle>
          <DialogDescription>{cp.platform}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-x-4 gap-y-2">
          <Text label="Delivery Time" value={`${cp.deliveryTime || "_"} days`} />
          <Text label="Delivery Date" value={cp.deliveryDate || "_"} />
          <Text label="Zone" value={cp.zone} />
          <Text label="Mode" value={cp.is_surface ? "Surface" : "Air"} />

          <Text label="Weight" value={`${sd.box.weight} grams`} />
          <Text label="Length" value={`${sd.box.length} cm`} />
          <Text label="Width" value={`${sd.box.width} cm`} />
          <Text label="Height" value={`${sd.box.height} cm`} />

          <Text label="Warehouse Pincode" value={sd.warehouse.pincode} />
          <Text label="Delivery Pincode" value={sd.delivery.pincode} />
        </div>
        <Separator />
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-x-4 gap-y-2 items-end">
          <div>
            <Text label="Base Charge" value={`₹${sd.payment.totalAmount}`} className="text-sm" />
            <Text label="Delivery Charge" value={`₹${sd.payment.delivery}`} className="text-sm" />
            <Text label="Gift Wrap Charge" value={`₹${sd.payment.giftWrap}`} className="text-sm" />
            <Text label="Total Shipment Value" value={`₹${sd.payment.subTotal}`} />
          </div>
          <Text label="Platform Charge" value={`₹${cp.courier_charge}`} />
        </div>

        <DialogFooter>
          <Button disabled={isCreating} type="submit" className="bg-success rounded" onClick={() => onSelect(cp)}>
            {isCreating ? "Creating Shipment..." : "Create Shipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Text = ({ label, value, className }: { label: string; value: string; className?: string }) => {
  return (
    <div className={`flex justify-between ${className}`}>
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
};
