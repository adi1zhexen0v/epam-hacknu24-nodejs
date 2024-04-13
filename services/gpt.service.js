import axios from "axios";

const GPT_SECRET_KEY = process.env.GPT_SECRET_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

class GptService {
  constructor() {
    this.apiKey = GPT_SECRET_KEY;
    this.apiUrl = API_URL;
  }

  generateGrammarTask(locations) {
    const location = locations.join(", ");
    return `Create three grammar exercises for a Kazakh language learner at a ${location}. Each exercise should include:
            1. An original sentence in Russian related to a typical activity at a ${location}, no longer than 8 words.
            2. A translation of this sentence into Kazakh.
            3. A list of partial words which includes all the words from the Kazakh sentence and an additional 2-3 unrelated words.

            The exercises should be returned as an array of objects, each object having the fields: originalSentence, kazakhSentence, and partials. The response should be entirely in Kazakh.`;
  }

  generateSpeakingTask(locations) {
    const location = locations.join(", ");
    return `Create a brief speaking task for a Kazakh language learner at a ${location}. Only one task, without AND. Please keep the instruction under 17 words in Kazakh. Response should be like object with field 'task';`;
  }

  async createGrammarTask(locations) {
    const prompt = this.generateGrammarTask(locations);
    const data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 1,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      return {
        result: JSON.parse(response.data.choices[0].message.content),
        error: null,
      };
    } catch (error) {
      return { result: null, error: new Error(error.toString()) };
    }
  }

  async createSpeakingTask(locations) {
    const prompt = this.generateSpeakingTask(locations);
    const data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 1,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      return {
        result: JSON.parse(response.data.choices[0].message.content),
        error: null,
      };
    } catch (error) {
      return { result: null, error: new Error(error.toString()) };
    }
  }

  async evaluateResponse(taskText, responseText) {
    const prompt = `Given the task in Kazakh: "${taskText}", evaluate the response: "${responseText}". Is the response correct and culturally appropriate? Provide a brief comment (up to 10 words) starting with "Дұрыс" if correct or "Дұрыс емес" if incorrect. Response should be { isCorrect: boolean, which depend on the start of sentence Дұрыс or Дұрыс емес, comment: response from gpt };`;
    const data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 1,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      return {
        result: JSON.parse(response.data.choices[0].message.content),
        error: null,
      };
    } catch (error) {
      return { result: null, error: new Error(error.toString()) };
    }
  }
}

export default new GptService();
