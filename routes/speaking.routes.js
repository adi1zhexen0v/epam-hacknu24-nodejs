import { Router } from "express";
import {
  checkSpeakingTask,
  createSpeakingTask
} from "../controllers/speaking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", createSpeakingTask);
router.post("/check", authUser, upload.single("file"), checkSpeakingTask);

export default router;
