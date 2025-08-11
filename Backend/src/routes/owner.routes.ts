import { Router } from "express";
import * as ownerController from "../controllers/owner.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`Owner route accessed: ${req.method} ${req.path}`);
  next();
});

// Test route without auth for initial testing
router.get("/open-test", (req, res) => {
  console.log("Open test route accessed");
  res.json({ message: "Open test route working - no auth required" });
});

// All routes require authentication and owner role
router.use(auth, requireRole(["owner", "admin"]));

// Test route with auth
router.get("/test", ownerController.testRoute);

// Venue management
router.get("/venues", ownerController.getOwnerVenues);
router.post("/venues", ownerController.createVenue);
router.get("/venues/:venueId", ownerController.getVenueStats);
router.get("/venues/:venueId/stats", ownerController.getVenueStats); // Alternative route for stats
router.get("/venues/:venueId/bookings", ownerController.getVenueBookings);
router.post("/venues/:venueId/courts", ownerController.createCourt);

export default router;