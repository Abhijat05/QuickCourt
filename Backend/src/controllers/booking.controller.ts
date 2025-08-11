import { Request, Response } from "express";
import { db } from "../config/db";
import { bookings, courts, venues, users, publicGames, gameParticipants } from "../db/schema";
import { eq, and, or, gte, lte, gt, lt, between } from "drizzle-orm";
import { sendEmail } from "../utils/email";

// Create a new booking
export const createBooking = async (req: Request & { user?: any }, res: Response) => {
  const { courtId, date, startTime, endTime, makePublic, gameDetails } = req.body; // Include makePublic and gameDetails
  const userId = req.user.id;
  
  try {
    // Check if court exists
    const courtInfo = await db.select().from(courts).where(eq(courts.id, courtId));
    if (!courtInfo[0]) {
      return res.status(404).json({ message: "Court not found" });
    }
    
    // Check for time conflicts (another booking in the same time slot)
    const bookingDate = new Date(date);
    const conflicts = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      courtId: bookings.courtId,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.courtId, courtId),
        eq(bookings.date, bookingDate),
        eq(bookings.status, "confirmed"), // Only check confirmed bookings
        or(
          // New booking starts during an existing booking
          and(
            gte(bookings.startTime, startTime),
            lt(bookings.startTime, endTime)
          ),
          // New booking ends during an existing booking
          and(
            gt(bookings.endTime, startTime),
            lte(bookings.endTime, endTime)
          ),
          // New booking completely contains an existing booking
          and(
            lte(bookings.startTime, startTime),
            gte(bookings.endTime, endTime)
          )
        )
      )
    );
    
    if (conflicts.length > 0) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }
    
    // Calculate price automatically based on court hourly rate and duration
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const duration = endHour - startHour;
    const calculatedPrice = courtInfo[0].pricePerHour * duration;
    
    // Create the booking - without explicitly adding totalPrice
    const [newBooking] = await db.insert(bookings).values({
      userId,
      courtId,
      date: bookingDate,
      startTime,
      endTime,
      status: "confirmed"
    }).returning({
      id: bookings.id,
      userId: bookings.userId,
      courtId: bookings.courtId,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status,
      createdAt: bookings.createdAt
    });
    
    // If user wants to make it a public game
    if (makePublic && gameDetails) {
      // Store the returned game object
      const [newGame] = await db.insert(publicGames)
        .values({
          bookingId: newBooking.id,
          hostId: userId,
          title: gameDetails.title,
          description: gameDetails.description || null,
          maxPlayers: gameDetails.maxPlayers,
          currentPlayers: 1, // Explicitly set to 1 for the host
          skillLevel: gameDetails.skillLevel || "intermediate",
          status: "open"
        })
        .returning(); // Add .returning() to get the inserted game
      
      // Add the host as the first participant
      await db.insert(gameParticipants)
        .values({
          gameId: newGame.id, // Now newGame is defined
          userId,
          status: "confirmed"
        });
    }
    
    // Get user information for email
    const user = await db.select().from(users).where(eq(users.id, userId));
    
    // Get venue and court information
    const venueInfo = await db.select()
      .from(venues)
      .where(eq(venues.id, courtInfo[0].venueId));
    
    // Send confirmation email
    await sendEmail(
      user[0].email,
      "QuickCourt Booking Confirmation",
      `Your booking at ${venueInfo[0].name} for ${courtInfo[0].name} on ${date} from ${startTime} to ${endTime} has been confirmed.`,
      `<h2>Booking Confirmation</h2>
      <p>Thank you for booking with QuickCourt!</p>
      <p><strong>Venue:</strong> ${venueInfo[0].name}</p>
      <p><strong>Court:</strong> ${courtInfo[0].name}</p>
      <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${startTime} to ${endTime}</p>
      <p><strong>Total Price:</strong> $${calculatedPrice}</p>
      <p>We look forward to seeing you!</p>`
    );
    
    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...newBooking,
        calculatedPrice // Return the calculated price to the client
      }
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get bookings for current user
export const getUserBookings = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  
  try {
    const userBookings = await db.select({
      id: bookings.id,
      courtId: bookings.courtId,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status,
      createdAt: bookings.createdAt
    })
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(bookings.date, bookings.startTime);
    
    // Enhance booking data with venue and court info
    const enhancedBookings = await Promise.all(userBookings.map(async (booking) => {
      const courtInfo = await db.select().from(courts).where(eq(courts.id, booking.courtId));
      const venueInfo = await db.select().from(venues).where(eq(venues.id, courtInfo[0].venueId));
      
      // Calculate price based on duration and court rate
      const startHour = parseInt(booking.startTime.split(':')[0]);
      const endHour = parseInt(booking.endTime.split(':')[0]);
      const duration = endHour - startHour;
      const calculatedPrice = courtInfo[0].pricePerHour * duration;
      
      return {
        ...booking,
        venueName: venueInfo[0].name,
        courtName: courtInfo[0].name,
        calculatedPrice
      };
    }));
    
    res.json(enhancedBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get booking details by ID
export const getBookingById = async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const booking = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      courtId: bookings.courtId,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status,
      createdAt: bookings.createdAt
    })
    .from(bookings)
    .where(eq(bookings.id, parseInt(id)));
    
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Only allow the booking user or admin to view details
    if (booking[0].userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    
    // Add court and venue information
    const courtInfo = await db.select().from(courts).where(eq(courts.id, booking[0].courtId));
    const venueInfo = await db.select().from(venues).where(eq(venues.id, courtInfo[0].venueId));
    
    // Calculate price based on duration and court rate
    const startHour = parseInt(booking[0].startTime.split(':')[0]);
    const endHour = parseInt(booking[0].endTime.split(':')[0]);
    const duration = endHour - startHour;
    const calculatedPrice = courtInfo[0].pricePerHour * duration;
    
    const enhancedBooking = {
      ...booking[0],
      court: {
        id: courtInfo[0].id,
        name: courtInfo[0].name,
        sportType: courtInfo[0].sportType,
        pricePerHour: courtInfo[0].pricePerHour
      },
      venue: {
        id: venueInfo[0].id,
        name: venueInfo[0].name,
        address: venueInfo[0].address
      },
      calculatedPrice
    };
    
    res.json(enhancedBooking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
};

// Cancel booking
export const cancelBooking = async (req: Request & { user?: any }, res: Response) => {
  const { bookingId } = req.params;  // Changed from id to bookingId to match route
  const userId = req.user.id;
  
  try {
    // Make sure bookingId is a valid number
    const bookingIdNum = parseInt(bookingId);
    if (isNaN(bookingIdNum)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await db.select().from(bookings).where(eq(bookings.id, bookingIdNum));
    
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Only allow the booking user to cancel
    if (booking[0].userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    
    // Check if booking can be cancelled (not in the past)
    const bookingDate = new Date(booking[0].date);
    bookingDate.setHours(parseInt(booking[0].startTime.split(':')[0]));
    
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: "Cannot cancel past bookings" });
    }
    
    // Update booking status
    await db.update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, bookingIdNum));
    
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};