import { Router } from "express";
import {
  getMe,
  incrementUserGrammarPoints,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authUser, getMe);
router.post("/increment/grammar", authUser, incrementUserGrammarPoints);

export default router;
