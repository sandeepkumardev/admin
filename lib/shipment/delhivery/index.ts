import { ICourier } from "@/types";
import { api } from "./api";
import _, { capitalize } from "lodash";

export class Delhivery {
  platform: string;

  constructor() {
    this.platform = "delhivery";
  }

  // get courier services method
  async getCourierServices(obj: Record<string, string>, retryCount: number = 0): Promise<ICourier[]> {
    if (retryCount > 1) {
      console.error("Maximum retry attempts reached for token refresh.");
      return [];
    }

    const token = process.env.DELHIVERY_TOKEN;

    try {
      const res = await fetch(
        `${api.checkCourierServiceability}?md=${capitalize(obj.dm)}&cgm=${obj.w}&o_pin=${obj.p_pin}&d_pin=${
          obj.d_pin
        }&ss=Delivered&pt=${obj.pm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      ).then((res) => res.json());

      if (res.status_code === 401) {
        console.log("Delhivery token expired! Reinitializing...");
        return this.getCourierServices(obj, retryCount + 1);
      }

      if (res.error) {
        console.log("Error fetching Delhivery services:", res);
        return [];
      }

      const data = _.map(res, (item: any) => ({
        platform: this.platform,
        courier_id: item.courier_id || "",
        courier_name: "Delhivery",
        courier_charge: item.total_amount,
        is_surface: capitalize(obj.dm) === "S" ? true : false,
        zone: item.zone,
        deliveryTime: item.tat || "",
        deliveryDate: item.etd || "",
      }));

      return data;
    } catch (error) {
      console.log("Error fetching Delhivery services:", error);
      return [];
    }
  }

  // create shipment order method
  async createShipment(shipment: any, courier: any): Promise<any> {
    return {
      platform: this.platform,
    };
  }

  // cancel courier
  async cancelCourier(): Promise<any> {}

  // cancel order
  async cancelOrder(): Promise<any> {}

  // track shipment
  async trackCourier(): Promise<any> {}

  // schedule pickup
  async schedulePickup(): Promise<any> {}
}
