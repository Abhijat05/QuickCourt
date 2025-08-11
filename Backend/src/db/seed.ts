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
      
      // Test password verification
      const verifyPassword = await bcrypt.compare(PASSWORD, passwordHash);
      console.log("Password verification test:", verifyPassword ? "PASSED" : "FAILED");
    } else {
      console.log("Admin user already exists - updating role and password");
      
      // Update the role and reset the password
      const newPasswordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
      
      await db.update(users)
        .set({ 
          role: "admin", 
          isVerified: true,
          passwordHash: newPasswordHash 
        })
        .where(eq(users.email, "garv3144@gmail.com"));
        
      console.log("Admin role and password updated successfully");
      
      // Test password verification after update
      const updatedUser = await db.select().from(users).where(eq(users.email, "garv3144@gmail.com"));
      if (updatedUser.length > 0) {
        const verifyPassword = await bcrypt.compare(PASSWORD, updatedUser[0].passwordHash);
        console.log("Updated password verification test:", verifyPassword ? "PASSED" : "FAILED");
      }
    }

    console.log("Database seed completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();