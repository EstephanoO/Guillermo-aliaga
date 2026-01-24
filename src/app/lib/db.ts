import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let cachedDb: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (cachedDb) {
    return cachedDb;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL for Neon connection.");
  }

  const sql = neon(databaseUrl);
  cachedDb = drizzle(sql);
  return cachedDb;
};
