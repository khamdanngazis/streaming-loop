import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "xxxasas";

export function generateYoutubeOauthState(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10m" });
}

export function verifyYoutubeOauthState(state: string): { userId: string } {
  return jwt.verify(state, JWT_SECRET) as { userId: string };
}