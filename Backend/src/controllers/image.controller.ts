import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../config/db";
import { venues, courts } from "../db/schema";
import { eq, and } from "drizzle-orm";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure upload middleware
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  }
});

// Upload venue image
export const uploadVenueImage = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
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
    
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    // Get the base URL from request for constructing image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Save image URL to database
    // This assumes you've added an 'imageUrl' field to your venues table in the schema
    await db.update(venues)
      .set({ imageUrl: imageUrl })
      .where(eq(venues.id, parseInt(venueId)));
    
    res.json({
      message: "Venue image uploaded successfully",
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Error uploading venue image:", error);
    res.status(500).json({ message: "Failed to upload venue image" });
  }
};

// Upload court image
export const uploadCourtImage = async (req: Request & { user?: any }, res: Response) => {
  const { courtId } = req.params;
  const ownerId = req.user.id;
  
  try {
    // Verify court ownership
    const court = await db.select()
      .from(courts)
      .innerJoin(venues, eq(venues.id, courts.venueId))
      .where(and(
        eq(courts.id, parseInt(courtId)),
        eq(venues.ownerId, ownerId)
      ));
      
    if (court.length === 0) {
      return res.status(403).json({ message: "You don't have access to this court" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    // Get the base URL from request
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Save image URL to database
    await db.update(courts)
      .set({ imageUrl: imageUrl })
      .where(eq(courts.id, parseInt(courtId)));
    
    res.json({
      message: "Court image uploaded successfully",
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Error uploading court image:", error);
    res.status(500).json({ message: "Failed to upload court image" });
  }
};

// Get venue images
export const getVenueImages = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  
  try {
    const venue = await db.select({
      id: venues.id,
      name: venues.name,
      imageUrl: venues.imageUrl
    })
    .from(venues)
    .where(eq(venues.id, parseInt(venueId)));
    
    if (venue.length === 0) {
      return res.status(404).json({ message: "Venue not found" });
    }
    
    // Get all courts with images
    const courtsList = await db.select({
      id: courts.id,
      name: courts.name,
      imageUrl: courts.imageUrl
    })
    .from(courts)
    .where(eq(courts.venueId, parseInt(venueId)));
    
    res.json({
      venue: venue[0],
      courts: courtsList
    });
  } catch (error) {
    console.error("Error fetching venue images:", error);
    res.status(500).json({ message: "Failed to fetch venue images" });
  }
};

// Add this function to allow multiple images
export const uploadMultipleVenueImages = async (req: Request & { user?: any }, res: Response) => {
  const { venueId } = req.params;
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
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `${baseUrl}/uploads/${file.filename}`);
    
    // In a real app, you'd have a separate table for venue_images
    // For simplicity, we'll store the main image in the venues table
    await db.update(venues)
      .set({ imageUrl: imageUrls[0] })
      .where(eq(venues.id, parseInt(venueId)));
    
    res.json({
      message: "Venue images uploaded successfully",
      imageUrls: imageUrls
    });
  } catch (error) {
    console.error("Error uploading venue images:", error);
    res.status(500).json({ message: "Failed to upload venue images" });
  }
};