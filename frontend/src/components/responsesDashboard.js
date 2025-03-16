import React, { useEffect, useState } from "react";
import { getAllResponses } from "../api";
import Sidebar from "./sidebar";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const drawerWidth = 50;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await getAllResponses();

        const processedData = {};

        data.forEach((res) => {
          if (!res.userId || !res.matchId || !res.questionId) return;

          const username = res.userId.username;
          const matchName = res.matchId.matchName;
          const matchDate=res.matchId.date;
          
          
          const questionName = res.questionId.text;
          const isCorrect = res.isCorrect;

          if (!processedData[username]) {
            processedData[username] = { totalPoints: 0, matches: {} };
          }

          if (!processedData[username].matches[matchName]) {
            processedData[username].matches[matchName] = { totalPoints: 0, questions: {}  ,matchDate};
          }

          if (!processedData[username].matches[matchName].questions[questionName]) {
            processedData[username].matches[matchName].questions[questionName] = 0;
          }

          if (isCorrect) {
            processedData[username].matches[matchName].questions[questionName] += 1;
            processedData[username].matches[matchName].totalPoints += 1;
            processedData[username].totalPoints += 1;
          }
        });

        setUserData(processedData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const sortedUsers = Object.entries(userData).sort(
    (a, b) => b[1].totalPoints - a[1].totalPoints
  );

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
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#000",
            textAlign: "center",
            mb: 3,
          }}
        >
          🏆 Leaderboard
        </Typography>

        {sortedUsers.length === 0 ? (
          <Typography>No responses available.</Typography>
        ) : (
          sortedUsers.map(([username, data]) => (
            <Accordion
              key={username}
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                marginBottom: 2,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f1f8ff" },
              }}
            >
              <AccordionSummary>
                <Typography variant="h6" sx={{ color: "#000", flex: 1 }}>
                  {username}
                </Typography>
                <Typography variant="h6" sx={{ color: "#000" }}>
                  {data.totalPoints} Points
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(data.matches).sort((a, b) => b[1].matchDate.localeCompare(a[1].matchDate)).map(([matchName, matchData]) => (
                  <Accordion
                    key={matchName}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      marginBottom: 1,
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                    }}
                  >
                    <AccordionSummary>
                      <Typography variant="body1" sx={{ color: "#000" }}>
                        {matchName} - Points: {matchData.totalPoints}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper elevation={3} sx={{ p: 2, borderRadius: "8px" }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#ccc" }}>
                              <TableCell sx={{ color: "#000" }}>Question Name</TableCell>
                              <TableCell sx={{ color: "#000" }}>Points</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {Object.entries(matchData.questions).map(([question, points]) => (
                              <TableRow
                                key={question}
                                sx={{
                                  "&:nth-of-type(odd)": { backgroundColor: "#f0f4c3" },
                                  "&:hover": { backgroundColor: "#dcedc8" },
                                }}
                              >
                                <TableCell sx={{ color: "#000" }}>{question}</TableCell>
                                <TableCell sx={{ color: "#000" }}>{points}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
