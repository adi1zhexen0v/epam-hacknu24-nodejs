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
            1. An original sentence in Russian related to a typical activity at a ${location}, no longer than 10 words.
            2. A translation of this sentence into Kazakh.

            The exercises should be returned as an array of objects, each object having the fields: originalSentence and kazakhSentence. The response should be entirely in Kazakh.`;
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
      console.log(response.data.choices[0].message);
      return {
        result: JSON.parse(response.data.choices[0].message.content),
        error: null,
      };
    } catch (error) {
      return { result: null, error: new Error(error.toString()) };
    }
  }

  async createTestTasksFromText(baseText) {
    const prompt = `Based on the following text: "${baseText}" create three multiple-choice questions. Each question should be related to the text and include four options. Each question JSON object should have fields: question, options (an array of four strings), and correctAnswer. The response should be entirely in Kazakh`;
    const data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      console.log(response.data.choices[0].message);
      const tasks = JSON.parse(response.data.choices[0].message.content);
      return {
        result: tasks,
        error: null,
      };
    } catch (error) {
      console.error("Ошибка при создании тестовых заданий: ", error);
      return { result: null, error: new Error(error.toString()) };
    }
  }

  async createPhotoTask(locations) {
    const location = locations.join(", ");
    const prompt = `Generate a brief task in Kazakh for taking a photo at a ${location} that can be used to create questions later.  The task should be no more than 20 words. The response should be JSON object with field 'task'. The response should be entirely in Kazakh.`;
    const data = {
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.5,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      const task = JSON.parse(response.data.choices[0].message.content).task;
      return {
        task: task,
        error: null,
      };
    } catch (error) {
      console.error("Ошибка при создании задания на фотографирование:", error);
      return { task: null, error: new Error(error.toString()) };
    }
  }
}

//The response should be entirely in Kazakh

export default new GptService();
