import { db } from "../config/db";
import { users } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10; // Make sure this matches what's used in your auth controller
const PASSWORD = "Admin@123"; // Plain password 

const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");

    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, "garv3144@gmail.com"));
    
    if (existingAdmin.length === 0) {
      // Create admin user with explicit salt rounds
      const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
      
      await db.insert(users).values({
        fullName: "Admin User",
        email: "garv3144@gmail.com",
        passwordHash,
        isVerified: true,
        role: "admin"
      });
      
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
      
      // Check if the role is admin, if not update it
      if (existingAdmin[0].role !== "admin") {
        await db.update(users)
          .set({ role: "admin", isVerified: true })
          .where(eq(users.email, "garv3144@gmail.com"));
        
        console.log("Admin role updated successfully");
      }
      
      // Remove the password verification test and password update
      // This is what was causing the password check message
    }

    console.log("Database seed completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run seed when this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;