import { Request, Response } from "express";
import { db } from "../config/db";
import { venues, bookings, courts } from "../db/schema";
import { eq, and, between, inArray } from "drizzle-orm"; // Added inArray import

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
    
    // Get bookings with date filter
    let query = db.select({
      id: bookings.id,
      courtName: courts.name,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .where(inArray(bookings.courtId, courtIds));
    
    if (startDate && endDate) {
      query = query.where(between(
        bookings.date, 
        new Date(startDate as string), 
        new Date(endDate as string)
      ));
    }
    
    const bookingsData = await query.orderBy(bookings.date);
    
    // Convert to CSV format
    const headers = "ID,Court Name,Date,Start Time,End Time,Status\n";
    const rows = bookingsData.map(b => 
      `${b.id},"${b.courtName}",${b.date.toISOString().split('T')[0]},${b.startTime},${b.endTime},${b.status}`
    ).join("\n");
    
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