import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import apiRoutes from "./routes";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();

app.disable("x-powered-by");

// --- Reverse proxy ---
// Render sits behind a reverse proxy and forwards the client's IP
// through X-Forwarded-For. Trust the first proxy so Express can
// correctly determine req.ip for express-rate-limit.
app.set("trust proxy", 1);

// --- Security headers & parsing ---
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    frameguard: {
      action: "deny",
    },
    hsts:
      env.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  }),
);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Static uploads ---
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

// --- Root ---
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Portfolio Backend API",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// --- Health check ---
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    time: new Date().toISOString(),
  });
});

// --- API ---
app.use("/api", apiLimiter, apiRoutes);

// --- 404 + error handling ---
// These must remain last.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;