import { Request, Response } from "express";
import { db } from "../config/db";
import { bookings, courts, venues, users } from "../db/schema";
import { eq, and, lt, gte, inArray } from "drizzle-orm"; // Added users import

export const getUserDashboard = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  
  try {
    // Get all user bookings
    const userBookings = await db.select().from(bookings).where(eq(bookings.userId, userId));
    
    // Calculate stats
    const now = new Date();
    const pastBookings = userBookings.filter(booking => 
      new Date(booking.date) < now || 
      (new Date(booking.date).setHours(0,0,0,0) === now.setHours(0,0,0,0) && 
       parseInt(booking.endTime.split(':')[0]) < now.getHours())
    );
    
    const upcomingBookings = userBookings.filter(booking => 
      new Date(booking.date) > now || 
      (new Date(booking.date).setHours(0,0,0,0) === now.setHours(0,0,0,0) && 
       parseInt(booking.startTime.split(':')[0]) > now.getHours())
    );
    
    // Get unique sport types
    const courtIds = userBookings.map(booking => booking.courtId);
    const courtsInfo = await db.select().from(courts).where(inArray(courts.id, courtIds));
    const sportTypes = [...new Set(courtsInfo.map(court => court.sportType))];
    
    // Calculate total spend
    let totalSpend = 0;
    for (const booking of userBookings) {
      if (booking.status !== 'cancelled') {
        const court = courtsInfo.find(c => c.id === booking.courtId);
        if (court) {
          const startHour = parseInt(booking.startTime.split(':')[0]);
          const endHour = parseInt(booking.endTime.split(':')[0]);
          const duration = endHour - startHour;
          totalSpend += court.pricePerHour * duration;
        }
      }
    }
    
    res.json({
      totalBookings: userBookings.length,
      activeBookings: userBookings.filter(b => b.status === 'confirmed').length,
      pastBookings: pastBookings.length,
      upcomingBookings: upcomingBookings.length,
      cancelledBookings: userBookings.filter(b => b.status === 'cancelled').length,
      favoriteSports: sportTypes,
      totalSpend: totalSpend
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// Get user profile information
export const getUserProfile = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  
  try {
    const userProfile = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      isVerified: users.isVerified,
      twoFactorEnabled: users.twoFactorEnabled,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (userProfile.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(userProfile[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.id;
  const { fullName } = req.body;
  
  try {
    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({ message: "Full name cannot be empty" });
    }
    
    await db.update(users)
      .set({ fullName })
      .where(eq(users.id, userId));
    
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

// Get user booking history
export const getUserBookingHistory = async (req: Request & { user?: any }, res: Response) => {
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
      
      // Group bookings by month for history visualization
      const bookingDate = new Date(booking.date);
      const month = bookingDate.toLocaleString('default', { month: 'long' });
      const year = bookingDate.getFullYear();
      const period = `${month} ${year}`;
      
      return {
        ...booking,
        venueName: venueInfo[0].name,
        venueAddress: venueInfo[0].address,
        courtName: courtInfo[0].name,
        sportType: courtInfo[0].sportType,
        price: calculatedPrice,
        period
      };
    }));
    
    // Group bookings by month for easier frontend display
    const groupedBookings = enhancedBookings.reduce((groups, booking) => {
      const period = booking.period;
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(booking);
      return groups;
    }, {});
    
    res.json({
      bookings: enhancedBookings,
      groupedBookings
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};