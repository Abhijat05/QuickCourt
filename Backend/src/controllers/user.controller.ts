import { Request, Response } from "express";
import { db } from "../config/db";
import { bookings, courts, venues } from "../db/schema";
import { eq, and, lt, gte, inArray } from "drizzle-orm"; // Added inArray import

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