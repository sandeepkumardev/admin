import { ICourier } from "@/types";
import { getBigshipToken } from "./token";
import { api } from "./api";
import _ from "lodash";

export class Bigship {
  platform: string;
  private static token: string | null = null;

  constructor() {
    this.platform = "bigship";
  }

  private async ensureToken(): Promise<void> {
    if (!Bigship.token) {
      Bigship.token = await getBigshipToken();
    }
  }

  // get courier services method
  async getCourierServices(obj: Record<string, string>, retryCount: number = 0): Promise<ICourier[]> {
    if (retryCount > 1) {
      console.error("Maximum retry attempts reached for token refresh.");
      return [];
    }

    await this.ensureToken();

    if (!Bigship.token) {
      return [];
    }

    try {
      const res = await fetch(`${api.checkCourierServiceability}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Bigship.token}`,
        },
        body: JSON.stringify({
          shipment_category: "B2C",
          payment_type: obj.pm === "pre-paid" ? "Prepaid" : "COD",
          pickup_pincode: obj.p_pin,
          destination_pincode: obj.d_pin,
          shipment_invoice_amount: obj.sv,
          risk_type: "",
          box_details: [
            {
              each_box_dead_weight: parseInt(obj.w) / 1000,
              each_box_length: obj.bl,
              each_box_width: obj.bw,
              each_box_height: obj.bh,
              box_count: 1,
            },
          ],
        }),
      }).then((res) => res.json());

      if (res.status_code === 401) {
        console.log("Bigship token expired! Reinitializing...");
        await this.ensureToken();
        return this.getCourierServices(obj, retryCount + 1);
      }

      const data = _.map(res.data, (item: any) => ({
        platform: this.platform,
        courier_id: item.courier_company_id || "",
        courier_name: item.courier_name,
        courier_charge: item.courier_charge,
        is_surface: item.courier_type === "Surface",
        zone: item.zone,
        deliveryTime: item.tat,
        deliveryDate: item.etd || "",
      }));

      return data;
    } catch (error) {
      console.log("Error fetching Bigship services:", error);
      return [];
    }
  }

  // create shipment order method
  async createShipment(shipment: any, courier: any): Promise<any> {
    await this.ensureToken();

    if (!Bigship.token) {
      return [];
    }
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
