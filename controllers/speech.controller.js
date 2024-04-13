import { SpeechService } from "../services/speech.service.js";

export async function transcribeAudio(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ result: null, error: "Загрузите аудиофайл" });
    }

    const speechService = new SpeechService();
    const transcription = await speechService.transcribe(req.file);

    if (typeof transcription === Error) {
      res.status(400).json({ result: null, error: transcription.toString() });
    }

    res.json({ result: transcription, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
