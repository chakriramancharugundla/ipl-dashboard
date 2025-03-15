import React, { useEffect, useState } from "react";
import { getAllResponses } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const drawerWidth = 50;

const UserResponsesTable = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchResponses = async () => {
      try {
        const data = await getAllResponses();
        const userResponses = data.filter((response) => response.userId._id === user._id);
        const processedData = {};

        userResponses.forEach((response) => {
          if (!response.matchId || !response.questionId) return;

          const matchName = response.matchId.matchName;
          const questionText = response.questionId.text;
          const isCorrect = response.isCorrect;

          if (!processedData[matchName]) {
            processedData[matchName] = { totalPoints: 0, questions: {} };
          }

          processedData[matchName].questions[questionText] = {
            points: isCorrect ? 1 : 0,
            response: response.selectedOption,
            isCorrect,
          };

          if (isCorrect) processedData[matchName].totalPoints += 1;
        });

        setUserData(processedData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [user]);

  if (loading) return <Typography>Loading...</Typography>;

  const sortedMatches = Object.entries(userData).sort((a, b) => b[1].totalPoints - a[1].totalPoints);

  return (
    <Box display="flex" sx={{ backgroundColor: "#e3f2fd", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#000", fontWeight: "bold", textAlign: "center", mb: 3 }}>
          My Responses
        </Typography>

        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mt: 4,
            p: 2,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            mb: 3,
          }}
        >
          🎯 Total Points: {sortedMatches.reduce((total, [, matchData]) => total + matchData.totalPoints, 0)}
        </Typography>

        {sortedMatches.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 3 }}>No responses available.</Typography>
        ) : (
          sortedMatches.map(([matchName, matchData]) => (
            <Accordion
              key={matchName}
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                marginBottom: 2,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f1f8ff" },
              }}
            >
              <AccordionSummary>
                <Typography sx={{ color: "#000" }}>{matchName}</Typography>
                <Typography sx={{ color: "#000", marginLeft: "auto" }}>{matchData.totalPoints} Points</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper elevation={3} sx={{ p: 2, borderRadius: "8px" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#ccc" }}>
                        <TableCell sx={{ color: "#000" }}>Question</TableCell>
                        <TableCell sx={{ color: "#000" }}>Your Response</TableCell>
                        <TableCell sx={{ color: "#000" }}>Correct?</TableCell>
                        <TableCell sx={{ color: "#000" }}>Points</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {Object.entries(matchData.questions).map(([questionText, details]) => (
                        <TableRow
                          key={questionText}
                          sx={{
                            "&:nth-of-type(odd)": { backgroundColor: "#f0f4c3" },
                            "&:hover": { backgroundColor: "#dcedc8" },
                          }}
                        >
                          <TableCell sx={{ color: "#000" }}>{questionText}</TableCell>
                          <TableCell sx={{ color: "#000" }}>{details.response || "N/A"}</TableCell>
                          <TableCell sx={{ color: "#000" }}>
                            {details.isCorrect !== null ? (details.isCorrect ? "✅" : "❌") : "Pending"}
                          </TableCell>
                          <TableCell sx={{ color: "#000" }}>{details.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
};

export default UserResponsesTable;
