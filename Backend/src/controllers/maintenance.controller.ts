import { Request, Response } from "express";
import { db } from "../config/db";
import { courts, venues } from "../db/schema";
import { eq, and } from "drizzle-orm";

// Create a new maintenance record table in schema.ts first
// Then implement these controllers

export const scheduleMaintenance = async (req: Request & { user?: any }, res: Response) => {
  const { courtId, startDate, endDate, reason } = req.body;
  const ownerId = req.user.id;
  
  try {
    // Verify court ownership
    const court = await db.select()
      .from(courts)
      .innerJoin(venues, eq(venues.id, courts.venueId))
      .where(and(
        eq(courts.id, courtId),
        eq(venues.ownerId, ownerId)
      ));
    
    if (court.length === 0) {
      return res.status(403).json({ message: "You don't have access to this court" });
    }
    
    // Create maintenance record
    await db.insert(maintenance)
      .values({
        courtId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        createdBy: ownerId
      });
    
    res.status(201).json({ message: "Maintenance scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling maintenance:", error);
    res.status(500).json({ message: "Failed to schedule maintenance" });
  }
};