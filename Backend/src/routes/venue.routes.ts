import { Router } from "express";
import * as venueController from "../controllers/venue.controller";

const router = Router();

router.get("/", venueController.getAllVenues);
router.get("/search", venueController.searchVenues);
router.get("/:id", venueController.getVenueById);

export default router;