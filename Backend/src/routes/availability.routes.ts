import { Router } from "express";
import * as availabilityController from "../controllers/availability.controller";

const router = Router();

router.get("/court/:courtId/date/:date", availabilityController.getCourtAvailability);

export default router;