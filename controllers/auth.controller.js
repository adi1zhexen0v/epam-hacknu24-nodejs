import { User } from "../models/user.model.js";
import { hashPassword, isPasswordValid } from "../services/bcrypt.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;

export async function register(req, res) {
  try {
    const { username, role, password } = req.body;

    const usernameAlreadyExists = await User.findOne({ username });
    if (usernameAlreadyExists) {
      res.status(409).json({ result: null, error: "Данный username занят" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await new User({
      username,
      role,
      password: hashedPassword,
    }).save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ result: { user: newUser, token }, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ result: null, error: "Неверный логин и пароль" });
    }

    const passwordIsValid = await isPasswordValid(password, user.password);
    if (!passwordIsValid) {
      res.status(404).json({ result: null, error: "Неверный логин и пароль" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
