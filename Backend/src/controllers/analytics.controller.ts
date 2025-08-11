import { Request, Response } from "express";
import { db } from "../config/db";
import { venues, bookings, courts } from "../db/schema";
import { eq, and, between, inArray, sql } from "drizzle-orm"; // Added sql import

export const exportBookingsCSV = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
  const { startDate, endDate } = req.query;
  const ownerId = req.user.id;
  
  try {
    // Verify venue ownership
    const venue = await db.select()
      .from(venues)
      .where(and(
        eq(venues.id, parseInt(venueId)),
        eq(venues.ownerId, ownerId)
      ));
      
    if (venue.length === 0) {
      return res.status(403).json({ message: "You don't have access to this venue" });
    }
    
    // Get all courts for this venue
    const venueCourts = await db.select().from(courts).where(eq(courts.venueId, parseInt(venueId)));
    const courtIds = venueCourts.map(court => court.id);
    
    // Build where conditions
    let whereConditions;
    
    // Check if both date parameters are provided
    if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
      whereConditions = and(
        inArray(bookings.courtId, courtIds),
        between(
          bookings.date, 
          new Date(startDate), 
          new Date(endDate)
        )
      );
    } else {
      // If no date range is provided, just filter by courtIds
      whereConditions = inArray(bookings.courtId, courtIds);
    }
    
    // Get bookings with all conditions in a single where clause
    const bookingsData = await db.select({
      id: bookings.id,
      courtName: courts.name,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .where(whereConditions)
    .orderBy(bookings.date);
    
    // Handle case where no bookings are found
    if (bookingsData.length === 0) {
      const headers = "ID,Court Name,Date,Start Time,End Time,Status\n";
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="venue_${venueId}_no_bookings.csv"`);
      res.send(headers);
      return;
    }
    
    // Convert to CSV format
    const headers = "ID,Court Name,Date,Start Time,End Time,Status\n";
    const rows = bookingsData.map(b => {
      // Safely handle date
      let dateStr = '';
      try {
        dateStr = b.date ? b.date.toISOString().split('T')[0] : '';
      } catch (e) {
        console.error("Date formatting error:", e);
        dateStr = '';
      }
      
      // Escape strings that might contain commas or quotes
      const escape = (str: string | null | undefined): string => {
        if (str === null || str === undefined) return '';
        const val = String(str);
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };
      
      return `${b.id},${escape(b.courtName)},${dateStr},${escape(b.startTime)},${escape(b.endTime)},${escape(b.status)}`;
    }).join("\n");
    
    const csv = headers + rows;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="venue_${venueId}_bookings.csv"`);
    
    res.send(csv);
  } catch (error) {
    console.error("Error exporting bookings:", error);
    res.status(500).json({ message: "Failed to export bookings" });
  }
};