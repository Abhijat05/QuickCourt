import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Fixing price_per_hour type inconsistencies");
    
    // Add a new script to handle string to string comparison for price_per_hour
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION compare_price_strings(price text, compare_value text, operation text) RETURNS boolean AS $$
      BEGIN
        IF operation = 'gt' THEN
          RETURN CAST(price AS numeric) > CAST(compare_value AS numeric);
        ELSIF operation = 'lt' THEN
          RETURN CAST(price AS numeric) < CAST(compare_value AS numeric);
        ELSIF operation = 'gte' THEN
          RETURN CAST(price AS numeric) >= CAST(compare_value AS numeric);
        ELSIF operation = 'lte' THEN
          RETURN CAST(price AS numeric) <= CAST(compare_value AS numeric);
        ELSIF operation = 'eq' THEN
          RETURN CAST(price AS numeric) = CAST(compare_value AS numeric);
        ELSE
          RETURN false;
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RETURN false;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();