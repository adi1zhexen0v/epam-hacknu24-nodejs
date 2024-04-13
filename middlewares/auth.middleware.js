import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

export const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ result: null, error: "Токен отсутствует" });
  }

  const token = authHeader.replace(/^Bearer\s+/, "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.isManager = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ result: null, error: "Невалидный токен" });
  }
};
