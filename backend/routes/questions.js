const express = require("express");
const Question = require("../models/Question");
const router = express.Router();

router.post("/:matchId", async (req, res) => {
  try {
    const { text, options } = req.body;
    if (!text || !Array.isArray(options) || options.length !== 2) {
      return res.status(400).json({ error: "Invalid question format" });
    }
    const newQuestion = new Question({ matchId: req.params.matchId, text, options });
    await newQuestion.save();
    res.json({ message: "Question added successfully", question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: "Error adding question" });
  }
});

router.get("/:matchId", async (req, res) => {
  try {
    const questions = await Question.find({ matchId: req.params.matchId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});


router.put("/update-answer/:questionId", async (req, res) => {
  try {
    const { correctAnswer } = req.body;
    
    if (!correctAnswer) {
      return res.status(400).json({ error: "Correct answer is required" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      { correctAnswer },
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Correct answer updated successfully", question: updatedQuestion });
  } catch (err) {
    console.error("Error updating correct answer:", err);
    res.status(500).json({ error: "Error updating correct answer" });
  }
});


module.exports = router;
