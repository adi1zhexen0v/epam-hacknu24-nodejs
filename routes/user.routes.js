import { Router } from "express";
import {
  getLeaderboard,
  getMe,
  incrementUserGrammarPoints,
  incrementUserReadingPoints,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authUser, getMe);
router.post("/increment/grammar", authUser, incrementUserGrammarPoints);
router.post("/increment/reading", authUser, incrementUserReadingPoints);
router.get("/leaderboard", getLeaderboard);

export default router;
