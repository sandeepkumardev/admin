export const api = {
  generateToken: "https://apiv2.shiprocket.in/v1/external/auth/login",
  checkCourierServiceability: "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
  createOrder: "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
  generateAWB: "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
  cancelAWB: "https://apiv2.shiprocket.in/v1/external/orders/cancel/shipment/awbs",
  cancelOrder: "https://apiv2.shiprocket.in/v1/external/orders/cancel",
  trackAWB: "https://apiv2.shiprocket.in/v1/external/courier/track/awb",
  schedulePickup: "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
};
