import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/venue/:venueId", reviewController.getVenueReviews);

// Protected routes
router.post("/", auth, reviewController.createReview);

export default router;