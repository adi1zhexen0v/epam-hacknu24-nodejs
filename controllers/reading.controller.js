import GptService from "../services/gpt.service.js";
import { readTextFromImage } from "../services/tesseract.service.js";
import { GoogleCloudStorageService } from "../services/file.service.js";

export async function createReadingTask(req, res) {
  try {
    const result = await GptService.createPhotoTask(req.body.locations);
    res.json({ ...result });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}

export async function createQuestionsByImage(req, res) {
  try {
    const fileStorage = new GoogleCloudStorageService();
    const path = await fileStorage.uploadFile(req.file, "reading");
    const text = await readTextFromImage(path);

    const result = await GptService.createTestTasksFromText(text);

    res.json({ ...result });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
