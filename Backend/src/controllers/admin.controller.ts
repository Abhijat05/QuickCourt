import { Request, Response } from "express";
import { db } from "../config/db";
import { users, venues, courts } from "../db/schema";
import { eq } from "drizzle-orm";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
      twoFactorEnabled: users.twoFactorEnabled,
      createdAt: users.createdAt,
    })
    .from(users);
    
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
      twoFactorEnabled: users.twoFactorEnabled,
      createdAt: users.createdAt,
      // Don't include sensitive info like passwordHash
    })
    .from(users)
    .where(eq(users.id, parseInt(userId)));
    
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get additional user information
    const userVenues = await db.select()
      .from(venues)
      .where(eq(venues.ownerId, parseInt(userId)));
    
    res.json({
      ...user[0],
      venues: userVenues
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

// Change user role
export const changeUserRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;

  if (!["user", "owner", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    await db.update(users)
      .set({ role })
      .where(eq(users.id, userId));
    
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role" });
  }
};

// Approve venue
export const approveVenue = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    await db.update(venues)
      .set({ approved: true })
      .where(eq(venues.id, parseInt(venueId)));
    
    res.json({ message: "Venue approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve venue" });
  }
};

// Get pending venue approvals
export const getPendingVenues = async (req: Request, res: Response) => {
  try {
    const pendingVenues = await db.select()
      .from(venues)
      .where(eq(venues.approved, false));
    
    res.json(pendingVenues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending venues" });
  }
};

// Delete user
export const deleteUser = async (req: Request & { user?: any }, res: Response) => {
  const { userId } = req.params;

  try {
    // First, check if the user exists
    const userExists = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.id, parseInt(userId)));
      
    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Make sure admin is not deleting themselves
    if (req.user && req.user.id === parseInt(userId)) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }
    
    // Delete the user
    await db.delete(users)
      .where(eq(users.id, parseInt(userId)));
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      message: "Failed to delete user", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// Create a venue as admin
export const createVenue = async (req: Request & { user?: any }, res: Response) => {
  const { name, description, address, location, sportTypes, amenities, pricePerHour, ownerId } = req.body;
  
  try {
    // Admin can specify an owner, or default to the admin user
    const targetOwnerId = ownerId || req.user.id;
    
    // Verify that the target owner exists
    const owner = await db.select().from(users).where(eq(users.id, targetOwnerId));
    if (owner.length === 0) {
      return res.status(400).json({ message: "Specified owner does not exist" });
    }
    
    // Create venue with automatic approval since admin is creating it
    const [newVenue] = await db.insert(venues)
      .values({
        ownerId: targetOwnerId,
        name,
        description,
        address,
        location,
        sportTypes,
        amenities,
        pricePerHour: parseFloat(pricePerHour),
        approved: true, // Auto-approve venues created by admin
        createdAt: new Date()
      })
      .returning();
    
    res.status(201).json({ 
      message: "Venue created successfully.",
      venue: newVenue 
    });
  } catch (error) {
    console.error("Error in createVenue:", error);
    res.status(500).json({ message: "Failed to create venue" });
  }
};

// Create a court as admin
export const createCourt = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
  const { name, sportType, pricePerHour, openingTime, closingTime } = req.body;
  
  try {
    // First verify venue exists
    const venue = await db.select()
      .from(venues)
      .where(eq(venues.id, parseInt(venueId)));
    
    if (venue.length === 0) {
      return res.status(404).json({ message: "Venue not found" });
    }
    
    // Create court with admin privileges (no ownership check needed)
    const [newCourt] = await db.insert(courts)
      .values({
        venueId: parseInt(venueId),
        name,
        sportType,
        pricePerHour: parseFloat(pricePerHour),
        openingTime: openingTime || "08:00",
        closingTime: closingTime || "22:00",
      })
      .returning();
    
    res.status(201).json({
      message: "Court created successfully",
      court: newCourt
    });
  } catch (error) {
    console.error("Error creating court:", error);
    res.status(500).json({ message: "Failed to create court" });
  }
};