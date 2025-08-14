import { rateLimit } from "express-rate-limit";

export const MINUTE = 60 * 1000;

export const rateLimiter = (windowMs = 60000, max = 30) => {
  return rateLimit({
    windowMs,
    max, // Limit each IP to limit requests per windowMs
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        errorCode: "TOO_MANY_REQUESTS",
        message: `Too many requests. Please try again after a time`,
      });
    },
  });
};
