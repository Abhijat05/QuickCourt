import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// All routes need authentication
router.use(auth);

// User profile and stats
router.get("/dashboard", userController.getUserDashboard);

export default router;