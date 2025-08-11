import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Adding rejection fields to venues table");
    
    // Add rejected column to venues table
    await db.execute(sql`
      ALTER TABLE venues 
      ADD COLUMN IF NOT EXISTS rejected BOOLEAN DEFAULT false
    `);
    
    // Add rejectionReason column to venues table
    await db.execute(sql`
      ALTER TABLE venues 
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();