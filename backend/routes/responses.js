const express = require("express");
const Response = require("../models/Response");
const Question = require("../models/Question");

const router = express.Router();

// 📌 ✅ Submit a user's response
router.post("/", async (req, res) => {
  try {
    const { userId, matchId, questionId, selectedOption } = req.body;

    if (!userId || !matchId || !questionId || !selectedOption) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (!question.options.includes(selectedOption)) {
      return res.status(400).json({ error: "Invalid selected option" });
    }

    const response = new Response({
      userId,
      matchId,
      questionId,
      selectedOption,
    });

    await response.save();
    res.json({ message: "Response recorded successfully", response });
  } catch (err) {
    res.status(500).json({ error: "Error saving response" });
  }
});

// 📌 ✅ Get all responses for a specific user & match
router.get("/:userId/:matchId", async (req, res) => {
  try {
    const { userId, matchId } = req.params;
    const responses = await Response.find({ userId, matchId }).populate("questionId");

    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching responses" });
  }
});

// 📌 ✅ Update correctness of responses after match completion
router.put("/update-correctness/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;

    // Fetch all questions for the match
    const questions = await Question.find({ matchId });
    
    // Update each response based on the correct answer
    for (let question of questions) {
      if (question.correctAnswer) {
        await Response.updateMany(
          { questionId: question._id, matchId },
          [
            {
              $set: {
                isCorrect: {
                  $eq: ["$selectedOption", question.correctAnswer]
                }
              }
            }
          ]
        );
      }
    }

    res.json({ message: "Responses updated based on correct answers" });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: "Error updating response correctness" });
  }
});






// 📌 ✅ Get all responses for a specific user across all matches
router.get("/all-responses", async (req, res) => {
  try {
    const responses = await Response.find()
      .populate("userId", "username") // Populate only username
      .populate("matchId", "matchName") // Populate match name
      .populate("questionId", "text"); // Populate question text

    if (!responses || responses.length === 0) {
      return res.status(404).json({ error: "No responses found" });
    }

    res.json(responses);
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ error: "Error fetching responses" });
  }
});





module.exports = router;
