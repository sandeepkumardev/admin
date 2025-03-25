import {
  ChartBarStacked,
  House,
  Package,
  PackagePlus,
  PackageSearch,
  Warehouse,
  BadgeCheck,
  Ban,
  CheckCheck,
  CircleDashed,
  PackageOpen,
  Ship,
  Timer,
  Truck,
  Undo2,
  XCircle,
  RefreshCcwDot,
  RotateCcw,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: House,
    route: "/",
    label: "Home",
  },
  {
    icon: PackagePlus,
    route: "/add-product",
    label: "Add Product",
  },
  {
    icon: PackageSearch,
    route: "/products",
    label: "Products",
  },
  {
    icon: ChartBarStacked,
    route: "/categories",
    label: "Categories",
  },
  {
    icon: Package,
    route: "/orders",
    label: "Orders",
  },
  {
    icon: Warehouse,
    route: "/warehouses",
    label: "Warehouses",
  },
];

export const defaultGenders = ["Male", "Female", "Unisex"];
export const sizeCategories = ["standard", "numeric", "footwear"];

export const status_options = [
  {
    value: "PAYMENT_PENDING",
    label: "Payment Pending",
    icon: CircleDashed,
    color: "#000000",
  },
  {
    value: "PAYMENT_FAILED",
    label: "Payment Failed",
    icon: CircleDashed,
    color: "#EF4444",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    icon: Timer,
    color: "#3B82F6",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    icon: BadgeCheck,
    color: "#10B981",
  },
  {
    value: "OUT_FOR_PICKUP",
    label: "Out for pickup",
    icon: RefreshCcwDot,
    color: "#10B981",
  },
  {
    value: "PICKED_UP",
    label: "Picked Up",
    icon: CheckCheck,
    color: "#10B981",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    icon: Ship,
    color: "#10B981",
  },
  {
    value: "IN_TRANSIT",
    label: "In Transit",
    icon: Truck,
    color: "#10B981",
  },
  {
    value: "REACHED_AT_DESTINATION",
    label: "Reached at destination",
    icon: Truck,
    color: "#10B981",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
    icon: Truck,
    color: "#10B981",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    icon: PackageOpen,
    color: "#10B981",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: Ban,
    color: "#EF4444",
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: XCircle,
    color: "#EF4444",
  },
  {
    value: "RETURN_REQUESTED",
    label: "Return Requested",
    icon: Undo2,
    color: "#F59E0B",
  },
  {
    value: "RETURNED",
    label: "Returned",
    icon: RotateCcw,
    color: "#F59E0B",
  },
  {
    value: "REFUNDED",
    label: "Refunded",
    icon: RefreshCcwDot,
    color: "#F59E0B",
  },
];
