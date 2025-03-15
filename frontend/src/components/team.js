import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { createTeam, joinTeam } from "../api";

const Team = ({ user }) => {
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");

  const handleCreateTeam = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await createTeam({ teamName }, token);
      alert(`Team Created! Share this ID: ${response.data.team._id}`);
    } catch (err) {
      alert("Error creating team");
    }
  };

  const handleJoinTeam = async () => {
    const token = localStorage.getItem("token");
    try {
      await joinTeam(teamId, token);
      alert("Joined team successfully!");
    } catch (err) {
      alert("Error joining team");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <CardContent>
        <Typography variant="h5">Manage Team</Typography>
        <TextField label="Team Name" fullWidth onChange={(e) => setTeamName(e.target.value)} />
        <Button onClick={handleCreateTeam} variant="contained" color="primary" fullWidth style={{ marginTop: 10 }}>
          Create Team
        </Button>

        <TextField label="Enter Team ID to Join" fullWidth onChange={(e) => setTeamId(e.target.value)} style={{ marginTop: 20 }} />
        <Button onClick={handleJoinTeam} variant="contained" color="secondary" fullWidth style={{ marginTop: 10 }}>
          Join Team
        </Button>
      </CardContent>
    </Card>
  );
};

export default Team;
