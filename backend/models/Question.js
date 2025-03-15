const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Match" },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, default: null }, // Initially null
  category: { type: String, required: true }, // ✅ Added category field
});

module.exports = mongoose.model("Question", QuestionSchema);
