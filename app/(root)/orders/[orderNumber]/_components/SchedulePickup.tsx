import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import React from "react";
import { format, toZonedTime } from "date-fns-tz";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const SchedulePickup = ({ shipmentId, platform }: { shipmentId: string; platform: string }) => {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

  const schedulePickup = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const utcDate = new Date(date);
      const istDate = toZonedTime(utcDate, "Asia/Kolkata");
      const formattedDate = format(istDate, "yyyy-MM-dd");

      const res = await fetch(`/api/shipment/schedule-pickup`, {
        method: "POST",
        body: JSON.stringify({ date: formattedDate, shipmentId: shipmentId, platform: platform }),
      }).then((res) => res.json());
      if (!res.ok) {
        toast({ title: res.error || "Error scheduling pickup" });
        return;
      }

      toast({ title: res.message || "Pickup scheduled successfully" });
    } catch (error) {
      console.log(error);
      toast({ title: "Error scheduling pickup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded" size={"sm"}>
          <Calendar className="mr-2 h-4 w-4" /> Schedule Pickup
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Schedule Pickup</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-3">
          <DialogDescription>When would you like to schedule the pickup?</DialogDescription>
          <div className="flex items-center gap-2">
            <DatePicker date={date} setDate={setDate} />
            <Button onClick={schedulePickup} disabled={!date || loading}>
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePickup;
