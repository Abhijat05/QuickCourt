import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { auth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication and admin role
router.use(auth, requireRole("admin"));

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/:userId", adminController.getUserById);
router.delete("/users/:userId", adminController.deleteUser); // Changed to delete endpoint
router.post("/users/role", adminController.changeUserRole);

// Venue approval
router.get("/venues/pending", adminController.getPendingVenues);
router.post("/venues/:venueId/approve", adminController.approveVenue);

export default router;