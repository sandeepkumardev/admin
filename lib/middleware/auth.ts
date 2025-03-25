import { verifyToken } from "../token";
import { NextRequest } from "next/server";

export const authenticate = async (req: NextRequest) => {
  const token = req.headers.get("authorization") || "";

  try {
    const result = await verifyToken(token, "ACCESS");
    if (!result.ok) {
      return { ok: false, message: result.error };
    }

    return { ok: true, user: result.data };
  } catch (error) {
    return { ok: false, message: "Invalid or expired token" };
  }
};
