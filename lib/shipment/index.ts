import { Bigship } from "./bigship";
import { Delhivery } from "./delhivery";
import { Shiprocket } from "./shiprocket";

export const courierClasses = {
  delhivery: Delhivery,
  bigship: Bigship,
  shiprocket: Shiprocket,
};

export const fetchActiveCouriersFromDB = async () => {
  // return ["shiprocket", "bigship", "delhivery"];
  return ["shiprocket"];
};
