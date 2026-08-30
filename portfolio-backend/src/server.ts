import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const port = Number(env.PORT);

const server = app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
