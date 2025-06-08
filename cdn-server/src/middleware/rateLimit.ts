import rateLimit from "express-rate-limit";

export const uploadRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // max 20 uploads per 10 minutes per IP
  message: "Too many uploads from this IP, please try again later.",
});