import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Adding opening and closing time fields to venues table");
    
    // Add opening_time column to venues table
    await db.execute(sql`
      ALTER TABLE venues 
      ADD COLUMN IF NOT EXISTS opening_time VARCHAR(10) DEFAULT '08:00'
    `);
    
    // Add closing_time column to venues table
    await db.execute(sql`
      ALTER TABLE venues 
      ADD COLUMN IF NOT EXISTS closing_time VARCHAR(10) DEFAULT '22:00'
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();