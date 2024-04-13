import { SpeechClient } from "@google-cloud/speech";

const {
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID,
} = process.env;

export class SpeechService {
  constructor() {
    const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    this.speechClient = new SpeechClient({
      credentials: {
        private_key_id: GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: GOOGLE_CLIENT_EMAIL,
        client_id: GOOGLE_CLIENT_ID,
      },
      projectId: GOOGLE_CLOUD_PROJECT_ID,
    });
  }

  async transcribe(file) {
    if (!file.buffer) {
      throw new Error("File buffer is empty or undefined.");
    }
    const audioContent = file.buffer.toString("base64");

    if (!audioContent) {
      throw new Error("Audio content is empty after base64 encoding.");
    }

    const audio = {
      content: audioContent,
    };
    const config = {
      encoding: "MP3",
      sampleRateHertz: 48000,
      languageCode: "kk-KZ",
    };
    const request = {
      audio: audio,
      config: config,
    };

    const response = await this.speechClient.recognize(request);
    const transcription = response[0].results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    return transcription;
  }
}
