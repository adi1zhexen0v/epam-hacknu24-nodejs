import { User } from "../models/user.model.js";

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);
    res.json({ result: user, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
