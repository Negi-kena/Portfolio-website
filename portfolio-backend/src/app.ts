import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import apiRoutes from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { prisma } from "./config/prisma";

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy that sets
// X-Forwarded-For. Express needs to trust it so req.ip resolves to the real
// client IP — required for express-rate-limit to work correctly here.
app.set("trust proxy", 1);

// --- Security & parsing ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Static uploads (images, resume PDF, etc.) ---
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Health check — also pings the DB, so an external cron hitting this
// route keeps both Render and Aiven's free tier from ever idling out ---
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, status: "ok", db: "connected", time: new Date().toISOString() });
  } catch {
    res.status(503).json({ success: false, status: "degraded", db: "unreachable", time: new Date().toISOString() });
  }
});

// --- API ---
app.use("/api", apiLimiter, apiRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;