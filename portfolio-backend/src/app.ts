import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import apiRoutes from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();

// --- Security & parsing ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Static uploads (images, resume PDF, etc.) ---
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Root ---
app.get("/", (_req, res) =>
  res.json({
    success: true,
    message: "Portfolio Backend API",
    endpoints: { health: "/health", api: "/api" },
  }),
);

// --- Health check ---
app.get("/health", (_req, res) =>
  res.json({ success: true, status: "ok", time: new Date().toISOString() }),
);

// --- API ---
app.use("/api", apiLimiter, apiRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
