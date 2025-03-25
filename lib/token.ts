import jwt from "jsonwebtoken";

export const generateTokens = (user: { id: string }) => {
  const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET || "");

  const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET || "");

  return { accessToken, refreshToken };
};

export const verifyToken = async (token: string, type: "ACCESS" | "REFRESH") => {
  try {
    if (!token.startsWith("Bearer ")) {
      return { ok: false, error: "Invalid token" };
    }

    const data = jwt.verify(
      token.split(" ")[1],
      type === "ACCESS" ? process.env.ACCESS_TOKEN_SECRET || "" : process.env.REFRESH_TOKEN_SECRET || ""
    );
    return { ok: true, data: JSON.parse(JSON.stringify(data)) };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
