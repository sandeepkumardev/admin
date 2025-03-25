import c from "crypto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/components/ui/use-toast";
import { ReactElement } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getData(url: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, { cache: "no-store" });
    if (!res.ok) {
      console.log("error -", "failed to fetch data");
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log("error -", error);
    return null;
  }
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const fetchOpt = {
  revalidateOnFocus: true,
  // dedupingInterval: 60000,
  revalidateOnMount: true,
};

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export async function computeSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export const generateFileName = (bytes = 32) => c.randomBytes(bytes).toString("hex");

export const createSlug = (name: string) => name.trim().replace(/\s+/g, "-").toLowerCase();

export const getPublicId = (url: string) => {
  const splitUrl = url.split("/upload/")[1].split("/").slice(1).join("/");
  return splitUrl.substring(0, splitUrl.lastIndexOf("."));
};

export const error = (msg: string) => toast({ title: "Error", description: msg, variant: "destructive" });
export const success = (msg: string, type?: "success" | "default", action?: ReactElement) =>
  toast({ title: "Success", description: msg, variant: type || "default", action });

export const generareHash = (str: string) => {
  const secret = process.env.NEXT_PUBLIC_SECRET || "";
  const hash = c.createHmac("sha256", secret).update(str).digest("hex");
  return hash;
};

export const verifyHash = (str: string, hash: string) => {
  const secret = process.env.NEXT_PUBLIC_SECRET || "";
  const newHash = c.createHmac("sha256", secret).update(str).digest("hex");
  return newHash === hash;
};

export const getDiscount = (mrp: number, price: number) => {
  return (((mrp - price) / mrp) * 100).toFixed(2);
};

export function boldNumbersInString(str: string) {
  return str.replace(/\d+/g, (match) => `<b>${match}</b>`);
}

// Helper function to format status labels
export const formatStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    ORDER_CREATED: "Order Created",
    PROCESSING: "Processing",
    CONFIRMED: "Order Confirmed",
    SHIPPED: "Shipped",
    OUT_FOR_PICKUP: "Out for Pickup",
    PICKED_UP: "Picked Up",
    IN_TRANSIT: "In Transit",
    REACHED_AT_DESTINATION: "Reached Destination",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    PAYMENT_PENDING: "Payment Pending",
    PAYMENT_FAILED: "Payment Failed",
    CANCELLED: "Order Cancelled",
    FAILED: "Order Failed",
    RETURN_REQUESTED: "Return Requested",
    RETURNED: "Returned",
    RETURN_FAILED: "Return Failed",
    RETURN_CANCELLED: "Return Cancelled",
    REFUNDED: "Refunded",
  };

  // return (
  //   statusLabels[status] ||
  //   status
  //     .split("_")
  //     .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
  //     .join(" ")
  // );

  return statusLabels[status] || null;
};
