import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Adding address column to users table");
    
    // Add address column to users table
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS address TEXT
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();