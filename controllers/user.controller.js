import { User } from "../models/user.model.js";

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);
    res.json({ result: user, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}

export async function incrementUserGrammarPoints(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { "mainPoints.grammarPoints": 1 } },
      { new: true }
    );
    res.json({ result: user, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}

export async function incrementUserReadingPoints(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { "mainPoints.readingPoints": 1 } },
      { new: true }
    );
    res.json({ result: user, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          totalPoints: {
            $add: [
              "$mainPoints.grammarPoints",
              "$mainPoints.readingPoints",
              "$mainPoints.speakingPoints",
            ],
          },
        },
      },
      {
        $sort: { totalPoints: -1 }, // Сортировка по убыванию
      },
    ]);
    res.json({ result: users, error: null });
  } catch (error) {
    res.status(500).json({ result: null, error: error.toString() });
  }
}
