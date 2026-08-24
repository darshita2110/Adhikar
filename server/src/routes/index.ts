import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /api/ping
 * Simple connectivity check — the client home page calls this
 * via TanStack Query to verify the client → server connection.
 */
router.get("/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong from server", timestamp: new Date().toISOString() });
});

export default router;
