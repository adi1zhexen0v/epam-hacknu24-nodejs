import { User } from "../models/user.model.js";
import { GoogleCloudStorageService } from "../services/file.service.js";
import GptService from "../services/gpt.service.js";
import { SpeechService } from "../services/speech.service.js";

export async function createSpeakingTask(req, res) {
  try {
    const result = await GptService.createSpeakingTask(req.body.locations);
    res.json({ ...result });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}


export async function checkSpeakingTask(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ result: null, error: "Загрузите аудиофайл" });
    }

    const fileStorage = new GoogleCloudStorageService();
    await fileStorage.uploadFile(req.file, "audio");

    const speechService = new SpeechService();
    const responseText = await speechService.transcribe(req.file);
    console.log(responseText);

    const result = await GptService.evaluateResponse(
      req.body.taskText,
      responseText
    );

    if (result.result.isCorrect) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { "mainPoints.speakingPoints": 3 },
      });
    }

    res.json({ ...result });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
