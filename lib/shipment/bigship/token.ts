import { api } from "./api";

export const getBigshipToken = async (retries = 3): Promise<string | null> => {
  while (retries > 0) {
    try {
      console.log("Fetching Bigship token...");

      const res = await fetch(api.generateToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: process.env.BIGSHIP_EMAIL,
          password: process.env.BIGSHIP_PASSWORD,
          access_key: process.env.BIGSHIP_ACCESS_KEY,
        }),
      }).then((res) => res.json());

      if (!res.data.token) {
        console.error("Failed to fetch Bigship token:", res);
        return null;
      }

      console.log("Bigship token fetched successfully");
      return res.data.token;
    } catch (error) {
      console.error("Failed to fetch Bigship token:", error);
      retries--;
      if (retries === 0) return null;
      console.log("Retrying to fetch Bigship token...");
    }
  }
  return null;
};
