import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface IShipment {
  platform: string;
  awb: string;
  shipmentId?: string;
  orderId?: string;
  orderNumber: string;
}

const Dropdown = ({ shipment }: { shipment: IShipment | null }) => {
  const [open, setOpen] = React.useState(false);
  const [openCancelCourierAlert, setOpenCancelCourierAlert] = React.useState(false);
  const [openCancelOrderAlert, setOpenCancelOrderAlert] = React.useState(false);

  if (!shipment) return null;
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"} className="h-8 w-8 p-0 rounded" variant={"destructive"} onClick={() => setOpen(true)}>
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shipment?.awb && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setOpenCancelCourierAlert(true);
                  setOpen(false);
                }}
              >
                Cancel Courier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {/* <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              setOpenCancelOrderAlert(true);
              setOpen(false);
            }}
          >
            Cancel Order
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <CancelCourier open={openCancelCourierAlert} setOpen={setOpenCancelCourierAlert} shipment={shipment} />
      <CancelOrder open={openCancelOrderAlert} setOpen={setOpenCancelOrderAlert} shipment={shipment} />
    </>
  );
};

const CancelCourier = ({
  open,
  setOpen,
  shipment,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shipment: IShipment;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleCancelCourier = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shipment/cancel-courier`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ awb: shipment.awb, platform: shipment.platform, orderNumber: shipment.orderNumber }),
      }).then((res) => res.json());
      if (!res.ok) {
        toast({ title: res.error || "Error canceling shipment" });
        return;
      }

      toast({ title: res.data.message || "Courier canceled successfully" });
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast({ title: "Error canceling shipment" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your current courier. You need to reasign the shipment
            to another courier.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleCancelCourier} disabled={loading}>
            {loading ? "Canceling..." : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CancelOrder = ({
  open,
  setOpen,
  shipment,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shipment: IShipment;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shipment/cancel-order`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          courierOrderId: shipment.orderId,
          platform: shipment.platform,
          orderNumber: shipment.orderNumber,
        }),
      }).then((res) => res.json());
      if (!res.ok) {
        toast({ title: res.error || "Error canceling order" });
        return;
      }

      toast({ title: res.data.message || "Order canceled successfully" });
      window.location.replace("/orders");
    } catch (error) {
      console.log(error);
      toast({ title: "Error canceling order" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleCancelOrder} disabled={loading}>
            {loading ? "Canceling..." : "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Dropdown;
