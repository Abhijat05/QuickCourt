import { Request, Response } from "express";
import { db } from "../config/db";
import { reviews, bookings, venues, users } from "../db/schema"; // Added users import
import { eq, and, lt } from "drizzle-orm";

export const createReview = async (req: Request & { user?: any }, res: Response) => {
  const { venueId, rating, comment } = req.body;
  const userId = req.user.id;
  
  try {
    // Verify the user has booked this venue in the past
    const venueBookings = await db.select()
      .from(bookings)
      .innerJoin(venues, eq(venues.id, venueId))
      .where(and(
        eq(bookings.userId, userId),
        lt(bookings.date, new Date()) // Only past bookings
      ));
      
    if (venueBookings.length === 0) {
      return res.status(403).json({ message: "You can only review venues you've booked" });
    }
    
    // Check if user already reviewed this venue
    const existingReview = await db.select()
      .from(reviews)
      .where(and(
        eq(reviews.userId, userId),
        eq(reviews.venueId, venueId)
      ));
    
    if (existingReview.length > 0) {
      // Update existing review
      await db.update(reviews)
        .set({ rating, comment })
        .where(eq(reviews.id, existingReview[0].id));
        
      return res.json({ message: "Review updated successfully" });
    }
    
    // Create new review
    await db.insert(reviews)
      .values({ userId, venueId, rating, comment });
    
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const getVenueReviews = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  
  try {
    const venueReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userFullName: users.fullName
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.venueId, parseInt(venueId)))
    .orderBy(reviews.createdAt);
    
    res.json(venueReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};