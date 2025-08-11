import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "quickcourt_user",
    password: "quickcourt_pass",
    database: "quickcourt_db",
    ssl:false,
  },    
} satisfies Config;
