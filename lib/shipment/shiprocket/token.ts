import { api } from "./api";

export const getShiprocketToken = async (retries = 3): Promise<string | null> => {
  while (retries > 0) {
    try {
      console.log("Fetching Shiprocket token...");

      const res = await fetch(api.generateToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        }),
      }).then((res) => res.json());

      if (!res.token) {
        console.error("Failed to fetch Shiprocket token:", res);
        return null;
      }

      console.log("Shiprocket token fetched successfully");
      return res.token;
    } catch (error) {
      console.error("Failed to fetch Shiprocket token:", error);
      retries--;
      if (retries === 0) return null;
      console.log("Retrying to fetch Shiprocket token...");
    }
  }
  return null;
};
