import React, { useEffect, useState } from "react";
import { getAllResponses } from "../api";
import Sidebar from "./sidebar"; // Import Sidebar
import { Box, Typography } from "@mui/material";
import "./responsesDashboard.css";

const drawerWidth = 240; // Sidebar width

const Dashboard = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await getAllResponses();
        setResponses(data);
        console.log("Fetched Data:", data);

        // Extract unique users correctly
        const uniqueUsers = Array.from(
          new Set(data.map((res) => res.userId?.username))
        ).filter(Boolean); // Remove null/undefined users

        // Extract all matches and ensure unique values
        const matchMap = {};
        data.forEach((res) => {
          if (res.matchId?.matchName) {
            matchMap[res.matchId.matchName] = res.matchId.matchName;
          }
        });
        const uniqueMatches = Object.values(matchMap);

        setUsers(uniqueUsers);
        setMatches(uniqueMatches);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`, // Ensures content is not overlapped by the sidebar
        }}
      >
        <Typography variant="h5" gutterBottom>
          📊 Match Points Dashboard
        </Typography>

        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="fixed-column">UserName</th>
                {matches.map((match) => (
                  <th key={match} className="scrollable-column">
                    {match}
                  </th>
                ))}
                <th className="fixed-column">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userResponses = responses.filter(
                  (res) => res.userId?.username === user
                );

                const matchPoints = matches.map((match) => {
                  const correctAnswers = userResponses.filter(
                    (res) => res.matchId?.matchName === match && res.isCorrect
                  ).length;
                  return correctAnswers;
                });

                const totalPoints = matchPoints.reduce(
                  (sum, points) => sum + points,
                  0
                );

                return (
                  <tr key={user}>
                    <td className="fixed-column">{user}</td>
                    {matchPoints.map((points, index) => (
                      <td key={index} className="scrollable-column">
                        {points}
                      </td>
                    ))}
                    <td className="fixed-column">{totalPoints}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
