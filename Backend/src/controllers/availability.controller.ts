import { Request, Response } from "express";
import { db } from "../config/db"; // Corrected import path
import { bookings, courts } from "../db/schema";
import { eq, and, between } from "drizzle-orm";

// Get available time slots for a court on a specific date
export const getCourtAvailability = async (req: Request, res: Response) => {
  const { courtId, date } = req.params;
  
  try {
    // Check if court exists
    const court = await db.select().from(courts).where(eq(courts.id, parseInt(courtId)));
    
    if (!court[0]) {
      return res.status(404).json({ message: "Court not found" });
    }
    
    // Get all bookings for this court on the requested date
    const bookingDate = new Date(date);
    const existingBookings = await db.select({
      startTime: bookings.startTime,
      endTime: bookings.endTime
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.courtId, parseInt(courtId)),
        eq(bookings.date, bookingDate),
        eq(bookings.status, "confirmed")
      )
    )
    .orderBy(bookings.startTime);
    
    // Create time slots (assuming the court is open from 6AM to 10PM)
    const openingTime = 6; // 6 AM
    const closingTime = 22; // 10 PM
    const timeSlotDuration = 1; // 1 hour slots
    
    const timeSlots = [];
    
    for (let hour = openingTime; hour < closingTime; hour += timeSlotDuration) {
      const startHour = `${hour.toString().padStart(2, '0')}:00`;
      const endHour = `${(hour + timeSlotDuration).toString().padStart(2, '0')}:00`;
      
      // Check if this time slot overlaps with any booking
      const isBooked = existingBookings.some((booking: { startTime: string, endTime: string }) => {
        const bookingStart = booking.startTime;
        const bookingEnd = booking.endTime;
        
        return (
          (startHour >= bookingStart && startHour < bookingEnd) || // Start time is within a booking
          (endHour > bookingStart && endHour <= bookingEnd) || // End time is within a booking
          (startHour <= bookingStart && endHour >= bookingEnd) // Time slot completely contains a booking
        );
      });
      
      timeSlots.push({
        startTime: startHour,
        endTime: endHour,
        available: !isBooked
      });
    }
    
    res.json(timeSlots);
  } catch (error) {
    console.error("Error fetching court availability:", error);
    res.status(500).json({ message: "Failed to fetch court availability" });
  }
};