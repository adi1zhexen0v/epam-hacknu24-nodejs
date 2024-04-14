import Tesseract from "tesseract.js";

export async function readTextFromImage(imagePath) {
  try {
    const result = await Tesseract.recognize(imagePath, "kaz", {
      logger: (m) => console.log(m)
    });
    const text = result.data.text;
    console.log("Распознанный текст:", text);
    return text; 
  } catch (error) {
    console.error("Ошибка при распознавании текста:", error);
    throw error; 
  }
}
