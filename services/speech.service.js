import { SpeechClient } from "@google-cloud/speech";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

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
    ffmpeg.setFfmpegPath(ffmpegStatic);

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

  async convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("mp3")
        .audioFrequency(48000)
        .on("error", (err) => {
          console.error(
            "An error occurred during the conversion:",
            err.message
          );
          reject(err);
        })
        .on("end", () => {
          console.log("File has been converted to MP3 format.");
          resolve();
        })
        .save(outputPath);
    });
  }

  async transcribe(file) {
    const audio = {
      content: file.buffer.toString("base64"),
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
