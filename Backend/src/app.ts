// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import ownerRoutes from "./routes/owner.routes";
import venueRoutes from "./routes/venue.routes";
import bookingRoutes from "./routes/booking.routes";
import availabilityRoutes from "./routes/availability.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import imageRoutes from "./routes/image.routes";
import gameRoutes from "./routes/game.routes";
import { errorHandler } from "./middlewares/error.middleware";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', '*'], // Add your frontend URL(s)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/games", gameRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/", (req, res) => {
  res.send("QuickCourt API is running 🚀");
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;