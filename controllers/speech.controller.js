import { GoogleCloudStorageService } from "../services/file.service.js";
import { SpeechService } from "../services/speech.service.js";

export async function transcribeAudio(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ result: null, error: "Загрузите аудиофайл" });
    }

    const fileStorage = new GoogleCloudStorageService();
    await fileStorage.uploadFile(req.file, "audio");

    const speechService = new SpeechService();
    const result = await speechService.transcribe(req.file);

    console.log();

    res.json({ result, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
