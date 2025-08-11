import { Request, Response } from "express";
import { db } from "../config/db"; // Corrected import path
import { venues, courts } from "../db/schema";
import { eq, and, like, gte, lte, sql } from "drizzle-orm"; // Added missing imports

// Get all approved venues
export const getAllVenues = async (req: Request, res: Response) => {
  try {
    const allVenues = await db.select().from(venues).where(eq(venues.approved, true));
    res.json(allVenues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

// Get venue details by ID
export const getVenueById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Get venue details
    const venue = await db.select().from(venues).where(eq(venues.id, parseInt(id)));
    
    if (!venue[0]) {
      return res.status(404).json({ message: "Venue not found" });
    }
    
    // Get courts for this venue
    const venueCourts = await db.select().from(courts).where(eq(courts.venueId, parseInt(id)));
    
    // Return combined data
    res.json({
      ...venue[0],
      courts: venueCourts
    });
  } catch (error) {
    console.error("Error fetching venue details:", error);
    res.status(500).json({ message: "Failed to fetch venue details" });
  }
};

// Search venues by criteria
export const searchVenues = async (req: Request, res: Response) => {
  const { sportType, location, priceMin, priceMax } = req.query;
  
  try {
    const baseQuery = db.select().from(venues);
    
    // Start with approved venues filter
    let conditions = [eq(venues.approved, true)];
    
    // Add additional filters if provided
    if (sportType) {
      conditions.push(like(venues.sportTypes, `%${sportType}%`));
    }
    
    if (location) {
      conditions.push(like(venues.location, `%${location}%`));
    }
    
    if (priceMin) {
      // Use sql template for safe type handling
      conditions.push(
        sql`compare_price_strings(${venues.pricePerHour}, ${priceMin as string}, 'gte')`
      );
    }
    
    if (priceMax) {
      conditions.push(
        sql`compare_price_strings(${venues.pricePerHour}, ${priceMax as string}, 'lte')`
      );
    }
    
    // Apply all conditions with AND
    const results = await baseQuery.where(and(...conditions));
    
    res.json(results);
  } catch (error) {
    console.error("Error searching venues:", error);
    res.status(500).json({ message: "Failed to search venues" });
  }
};