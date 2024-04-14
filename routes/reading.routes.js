import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createQuestionsByImage,
  createReadingTask,
} from "../controllers/reading.controller.js";

const router = Router();

router.post("/create", createReadingTask);
router.post("/questions", upload.single("img"), createQuestionsByImage);

export default router;
