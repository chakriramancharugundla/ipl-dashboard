import React, { useEffect, useState } from "react";
import { getAllResponses } from "../api"; // API function to fetch all responses
import { useAuth } from "../context/AuthContext";
import Sidebar from "./sidebar"; // Import Sidebar
import { Box, Typography } from "@mui/material";
import "./UserResponsesTable.css"; // Import CSS for styling

const drawerWidth = 240; // Sidebar width

const UserResponsesTable = () => {
  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user._id;
  console.log(userId);
  
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await getAllResponses(); // Fetch all responses
        setAllResponses(data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  // Filter responses for the specific user
  const userResponses = allResponses.filter(response => response.userId._id === userId);
  console.log(userResponses);
  
  

  // Calculate total correct answers
  const totalCorrect = userResponses.reduce((count, response) => count + (response.isCorrect ? 1 : 0), 0);

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
          📊 User Responses
        </Typography>

        <div className="user-responses-container">
          <table className="user-responses-table">
            <thead>
              <tr>
                <th>Match Name</th>
                <th>Question</th>
                <th>Your Response</th>
                <th>Correct?</th>
              </tr>
            </thead>
            <tbody>
              {userResponses.length > 0 ? (
                userResponses.map((response) => (
                  <tr key={response._id}>
                    <td>{response.matchId?.matchName || "N/A"}</td>
                    <td>{response.questionId?.text || "N/A"}</td>
                    <td>{response.selectedOption}</td>
                    <td className={response.isCorrect ? "correct" : "incorrect"}>
                      {response.isCorrect !== null ? (response.isCorrect ? "✅" : "❌") : "Pending"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No responses found</td>
                </tr>
              )}
              {/* Total Score Row */}
              <tr className="total-score-row">
                <td colSpan="3"><strong>Total Correct Answers:</strong></td>
                <td className="total-score">{totalCorrect}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
};

export default UserResponsesTable;
