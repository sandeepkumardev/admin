import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TrackShipment = ({ awb, platform }: { awb: string; platform: string }) => {
  const [activities, setActivities] = useState<any>([]);

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/shipment/track?awb=${awb}&platform=${platform}`).then((res) => res.json());
      if (!res.ok) return toast(res.error || "Error fetching activities");

      console.log(res.data.tracking_data);
      setActivities(res.data.tracking_data);
    } catch (error) {
      console.log(error);
      toast({ title: "Error fetching activities" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded " size={"sm"} onClick={fetchActivities}>
          Track
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <div className="flex gap-3 items-center">
          <DialogTitle>AWB: {awb}</DialogTitle>
          {activities.track_url && (
            <Link2
              className="mr-6"
              onClick={() => window.open(activities.track_url, "_blank")}
              style={{ cursor: "pointer", color: "blue" }}
            />
          )}
        </div>
        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackShipment;
