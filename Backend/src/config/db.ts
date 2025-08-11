import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "quickcourt_user",
  password: "quickcourt_pass",
  database: "quickcourt_db",
  ssl: false,
});

export const db = drizzle(pool, { schema });
