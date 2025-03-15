const express = require("express");
const Response = require("../models/Response");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/:matchId", async (req, res) => {
  try {
    const data = await Response.aggregate([
      { $match: { matchId: new mongoose.Types.ObjectId(req.params.matchId) } },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: { user: "$user", question: "$question.text" },
          answers: {
            $push: {
              answer: "$answer",
              isCorrect: "$isCorrect",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.user",
          responses: {
            $push: {
              question: "$_id.question",
              answers: "$answers",
            },
          },
          correctCount: { $sum: { $cond: ["$answers.isCorrect", 1, 0] } },
          wrongCount: { $sum: { $cond: ["$answers.isCorrect", 0, 1] } },
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

module.exports = router;
