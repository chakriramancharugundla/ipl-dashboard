const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User collection
    required: true,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: String,
  isCorrect: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);
module.exports = Response;
