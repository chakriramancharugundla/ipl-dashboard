const express = require("express");
const Match = require("../models/Match");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { matchName, date } = req.body;
    const newMatch = new Match({ matchName, date });
    await newMatch.save();
    res.json({ message: "Match added successfully", match: newMatch });
  } catch (err) {
    res.status(500).json({ error: "Error adding match" });
  }
});

router.get("/", async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Error fetching matches" });
  }
});

module.exports = router;
