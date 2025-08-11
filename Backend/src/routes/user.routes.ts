import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// All routes need authentication
router.use(auth);

// User profile and stats
router.get("/dashboard", userController.getUserDashboard);
router.get("/profile", userController.getUserProfile);
router.patch("/profile", userController.updateUserProfile);
router.get("/history", userController.getUserBookingHistory);

export default router;