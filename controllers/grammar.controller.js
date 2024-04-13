import GptService from "../services/gpt.service.js";

export async function createGrammarTask(req, res) {
  try {
    const result = await GptService.createGrammarTask(req.body.locations);
    res.json({ ...result });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
