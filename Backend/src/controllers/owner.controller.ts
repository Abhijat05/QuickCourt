import { Request, Response } from "express";
import { db } from "../config/db";
import { venues, courts, bookings, users } from "../db/schema";
import { eq, and, inArray, gte } from "drizzle-orm";

// Get all venues for the logged-in owner
export const getOwnerVenues = async (req: Request & { user?: any }, res: Response) => {
  try {
    const ownerVenues = await db.select()
      .from(venues)
      .where(eq(venues.ownerId, req.user.id));
    
    res.json(ownerVenues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

// Create a new venue
export const createVenue = async (req: Request & { user?: any }, res: Response) => {
  const { name, description, address, location, sportTypes, amenities, pricePerHour } = req.body;

  try {
    const normalizeCSV = (v: any) =>
      Array.isArray(v) ? v.join(',') : (typeof v === 'string' ? v : '');

    const venueData: any = {
      ownerId: req.user.id,
      name,
      description: description || null,
      address,
      location,
      sportTypes: normalizeCSV(sportTypes),
      amenities: normalizeCSV(amenities),
      pricePerHour: String(pricePerHour),
    };

    const newVenue = await db.insert(venues)
      .values(venueData)
      .returning();

    res.status(201).json({
      message: "Venue created successfully. Pending approval.",
      venue: newVenue
    });
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Failed to create venue" });
  }
};

// Get all bookings for an owner's venues
export const getVenueBookings = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
  
  try {
    const isAdmin = req.user?.role === 'admin';

    // Verify venue (admins can view any venue, owners only their own)
    const venue = isAdmin
      ? await db.select().from(venues).where(eq(venues.id, parseInt(venueId)))
      : await db.select()
          .from(venues)
          .where(and(
            eq(venues.id, parseInt(venueId)),
            eq(venues.ownerId, req.user.id)
          ));
    
    if (venue.length === 0) {
      return res.status(403).json({ message: "You don't have access to this venue" });
    }

    // Get all courts for this venue
    const venueCourts = await db.select()
      .from(courts)
      .where(eq(courts.venueId, parseInt(venueId)));
    
    // Get bookings for all courts
    const courtIds = venueCourts.map(court => court.id);
    
    if (courtIds.length === 0) {
      return res.json([]);  // Return empty array if no courts exist yet
    }
    
    const bookingsData = await db.select({
      booking: bookings,
      user: {
        fullName: users.fullName,
        email: users.email
      },
      court: {
        name: courts.name,
        sportType: courts.sportType
      }
    })
    .from(bookings)
    .where(inArray(bookings.courtId, courtIds))
    .innerJoin(users, eq(bookings.userId, users.id))
    .innerJoin(courts, eq(bookings.courtId, courts.id));
    
    res.json(bookingsData);
  } catch (error) {
    console.error("Error in getVenueBookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: String(error) });
  }
};

// Create a court for a venue
export const createCourt = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
  const { name, sportType, pricePerHour, openingTime, closingTime } = req.body;
  
  try {
    const venueIdNum = Number(venueId);
    if (!Number.isFinite(venueIdNum) || !Number.isInteger(venueIdNum)) {
      console.warn('createCourt: invalid venueId param', { venueId });
      return res.status(400).json({ message: "Invalid venueId" });
    }
    const price = Number(pricePerHour);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: "Invalid pricePerHour" });
    }

    // First verify venue ownership
    const venue = await db.select()
      .from(venues)
      .where(and(
        eq(venues.id, venueIdNum),
        eq(venues.ownerId, req.user.id)
      ));
    
    if (venue.length === 0) {
      return res.status(403).json({ message: "You don't have access to this venue" });
    }
    
    // Create court
    const [newCourt] = await db.insert(courts)
      .values({
        venueId: venueIdNum,
        name,
        sportType,
        pricePerHour: price,
        openingTime,
        closingTime,
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

// Get statistics for a venue
export const getVenueStats = async (req: Request & { user?: any }, res: Response) => {
  console.log("getVenueStats called with params:", req.params);
  console.log("User in request:", req.user);
  
  const { venueId } = req.params;
  const timeframe = req.query.timeframe as string || 'month'; // week, month, year
  
  try {
    // First verify ownership
    const venue = await db.select()
      .from(venues)
      .where(and(
        eq(venues.id, parseInt(venueId)),
        eq(venues.ownerId, req.user.id)
      ));
    
    if (venue.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all courts for this venue
    const venueCourts = await db.select()
      .from(courts)
      .where(eq(courts.venueId, parseInt(venueId)));
    
    // Get bookings for all courts
    const courtIds = venueCourts.map(court => court.id);
    
    if (courtIds.length === 0) {
      return res.json({ 
        totalBookings: 0,
        totalRevenue: 0,
        bookingsPerCourt: [],
        popularTimeSlots: [],
        bookingStatus: {
          confirmed: 0,
          cancelled: 0,
          completed: 0
        }
      });
    }
    
    // Calculate the date range based on timeframe
    const today = new Date();
    let startDate = new Date();
    
    switch(timeframe) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(today.getMonth() - 1); // Default to month
    }
    
    // Get all bookings in the date range
    const bookingsData = await db.select({
      id: bookings.id,
      courtId: bookings.courtId,
      date: bookings.date,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      status: bookings.status
    })
    .from(bookings)
    .where(
      and(
        inArray(bookings.courtId, courtIds),
        gte(bookings.date, startDate)
      )
    );
    
    // Get court information for calculating revenue
    const courtsInfo = await db.select()
      .from(courts)
      .where(inArray(courts.id, courtIds));
    
    const courtsMap = courtsInfo.reduce((map, court) => {
      map[court.id] = court;
      return map;
    }, {} as Record<number, typeof courtsInfo[0]>);
    
    // Calculate statistics
    const stats = {
      totalBookings: bookingsData.length,
      confirmedBookings: bookingsData.filter(b => b.status === 'confirmed').length,
      cancelledBookings: bookingsData.filter(b => b.status === 'cancelled').length,
      completedBookings: bookingsData.filter(b => b.status === 'completed').length,
      totalRevenue: 0,
      bookingsPerCourt: [] as {courtId: number, courtName: string, bookings: number}[],
      popularTimeSlots: [] as {startTime: string, count: number}[],
      bookingStatus: {
        confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
        cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
        completed: bookingsData.filter(b => b.status === 'completed').length,
      }
    };
    
    // Calculate revenue and bookings per court
    const bookingsByCourtId: Record<number, number> = {};
    const timeSlots: Record<string, number> = {};
    
    // Process each booking
    bookingsData.forEach(booking => {
      // Count bookings per court
      if (!bookingsByCourtId[booking.courtId]) {
        bookingsByCourtId[booking.courtId] = 0;
      }
      bookingsByCourtId[booking.courtId]++;
      
      // Track popular time slots
      if (!timeSlots[booking.startTime]) {
        timeSlots[booking.startTime] = 0;
      }
      timeSlots[booking.startTime]++;
      
      // Calculate revenue (if status is confirmed or completed)
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        const court = courtsMap[booking.courtId];
        if (court) {
          // Calculate hours booked
          const startHour = parseInt(booking.startTime.split(':')[0]);
          const endHour = parseInt(booking.endTime.split(':')[0]);
          const duration = endHour - startHour;
          
          // Add to total revenue
          stats.totalRevenue += court.pricePerHour * duration;
        }
      }
    });
    
    // Format bookings per court
    stats.bookingsPerCourt = Object.keys(bookingsByCourtId).map(courtIdStr => {
      const courtId = parseInt(courtIdStr);
      const court = courtsMap[courtId];
      return {
        courtId,
        courtName: court ? court.name : `Court ${courtId}`,
        bookings: bookingsByCourtId[courtId]
      };
    });
    
    // Format popular time slots
    stats.popularTimeSlots = Object.keys(timeSlots)
      .map(time => ({ startTime: time, count: timeSlots[time] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching venue stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};

// Test route function
export const testRoute = async (req: Request & { user?: any }, res: Response) => {
  console.log("Test route function called");
  console.log("User in request:", req.user);
  
  try {
    // Return basic information to verify everything is working
    res.json({
      message: "Owner test route is working correctly!",
      timestamp: new Date().toISOString(),
      user: {
        id: req.user.id,
        role: req.user.role
      },
      requestInfo: {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query
      }
    });
  } catch (error) {
    console.error("Error in test route:", error);
    res.status(500).json({ message: "Test route error", error: String(error) });
  }
};