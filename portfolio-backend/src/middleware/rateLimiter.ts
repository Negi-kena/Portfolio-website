import rateLimit from "express-rate-limit";

// General API limiter — generous, just guards against abuse
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for login attempts — mitigates brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for the public contact form — mitigates spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many messages sent. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for file uploads — prevents disk exhaustion
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: "Too many upload requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
