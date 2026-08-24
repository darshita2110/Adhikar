import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),

  // Redis / BullMQ
  REDIS_URL: z.string().url("REDIS_URL must be a valid connection URL").default("redis://localhost:6379"),

  // AI
  OPENAI_API_KEY: z.string().optional(),

  // CORS
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = _parsed.data;
export type Env = typeof env;
