import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env";
import apiRouter from "./routes";

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Health check — used by load balancers / Docker compose */
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", environment: env.NODE_ENV });
});

/** API routes */
app.use("/api", apiRouter);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(env.PORT, () => {
  console.log(`🚀 Adhikar server running on http://localhost:${env.PORT}`);
  console.log(`   Environment : ${env.NODE_ENV}`);
  console.log(`   Client origin: ${env.CLIENT_ORIGIN}`);
});

export default app;
