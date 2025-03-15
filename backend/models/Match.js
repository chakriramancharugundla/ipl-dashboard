const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  matchName: String,
  date: Date,
});

module.exports = mongoose.model("Match", MatchSchema);
