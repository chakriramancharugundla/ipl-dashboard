const express = require("express");
const Team = require("../models/Team");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new team
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { teamName } = req.body;
    const newTeam = new Team({ teamName, createdBy: req.user.userId, members: [req.user.userId] });
    await newTeam.save();
    res.json({ message: "Team created successfully", team: newTeam });
  } catch (err) {
    res.status(500).json({ error: "Error creating team" });
  }
});

// Join an existing team
router.post("/join/:teamId", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (team.members.includes(req.user.userId)) {
      return res.status(400).json({ error: "User already in team" });
    }

    team.members.push(req.user.userId);
    await team.save();
    res.json({ message: "Joined team successfully", team });
  } catch (err) {
    res.status(500).json({ error: "Error joining team" });
  }
});

// Get all teams of the logged-in user
router.get("/my-teams", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.userId }).populate("members", "username");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Error fetching teams" });
  }
});

module.exports = router;
