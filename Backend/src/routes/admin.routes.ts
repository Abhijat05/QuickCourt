import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication and admin role
router.use(auth, requireRole("admin"));

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/:userId", adminController.getUserById);
router.delete("/users/:userId", adminController.deleteUser);
router.post("/users/role", adminController.changeUserRole);

// Venue approval
router.get("/venues/pending", adminController.getPendingVenues);
router.patch("/venues/:venueId/approve", adminController.approveVenue);

// Venue rejection
router.patch("/venues/:venueId/reject", adminController.rejectVenue); // New endpoint for admin to reject venues

// Admin venue creation
router.post("/venues", adminController.createVenue);

// Admin court creation
router.post("/venues/:venueId/courts", adminController.createCourt); // New endpoint for admin to create courts

export default router;