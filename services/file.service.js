import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const {
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID,
  GOOGLE_BUCKET_NAME,
} = process.env;

export class GoogleCloudStorageService {
  constructor() {
    const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

    this.storage = new Storage({
      credentials: {
        private_key_id: GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: GOOGLE_CLIENT_EMAIL,
        client_id: GOOGLE_CLIENT_ID,
      },
      projectId: GOOGLE_CLOUD_PROJECT_ID,
    });

    this.bucketName = GOOGLE_BUCKET_NAME;
  }

  async uploadFile(file, folderName) {
    const bucket = this.storage.bucket(this.bucketName);

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folderName}/${uuidv4()}.${fileExtension}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    await new Promise((resolve, reject) => {
      blobStream.on("error", (err) => reject(err));
      blobStream.on("finish", async () => {
        try {
          await blob.makePublic();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      blobStream.end(file.buffer);
    });

    return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(
      fileName
    )}`;
  }
}
