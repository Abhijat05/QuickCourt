import { Router } from "express";
import * as gameController from "../controllers/game.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/public", gameController.getPublicGames);
router.get("/:gameId", gameController.getGameDetails);

// Protected routes
router.use(auth);
router.post("/create", gameController.createPublicGame);
router.post("/:gameId/join", gameController.joinPublicGame);
router.post("/:gameId/leave", gameController.leavePublicGame);
router.get("/user/participating", gameController.getUserGames);
router.get("/:gameId/participants", gameController.getGameParticipants);
router.get("/:gameId/check-participants", gameController.checkGameParticipants);

export default router;