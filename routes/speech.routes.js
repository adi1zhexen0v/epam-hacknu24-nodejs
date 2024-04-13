import { Router } from "express";
import { transcribeAudio } from "../controllers/speech.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/transcribe", upload.single("file"), transcribeAudio);

export default router;
