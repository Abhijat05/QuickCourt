import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// All booking routes require authentication
router.use(auth);

router.post("/", bookingController.createBooking);
router.get("/user", bookingController.getUserBookings);
router.patch("/:bookingId/cancel", bookingController.cancelBooking);
router.get("/:id", bookingController.getBookingById);

export default router;