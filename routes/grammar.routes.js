import { Router } from "express";
import { createGrammarTask } from "../controllers/grammar.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", createGrammarTask);

export default router;
