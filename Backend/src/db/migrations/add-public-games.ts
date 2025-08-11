import { sql } from "drizzle-orm";
import { db } from "../../config/db";

async function runMigration() {
  try {
    console.log("Running migration: Adding public games tables");
    
    // Create public_games table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public_games (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        max_players INTEGER NOT NULL,
        current_players INTEGER DEFAULT 1,
        skill_level VARCHAR(50),
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create game_participants table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_participants (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL REFERENCES public_games(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'confirmed',
        joined_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();