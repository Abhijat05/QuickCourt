import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Adding image_url columns");
    
    // Add image_url column to venues table
    await db.execute(sql`
      ALTER TABLE venues 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `);
    
    // Add image_url column to courts table
    await db.execute(sql`
      ALTER TABLE courts 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();