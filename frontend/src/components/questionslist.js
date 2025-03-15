import React, { useEffect, useState } from "react";
import { getMatches, getQuestions } from "../api"; // Ensure these functions call your backend
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "./sidebar";

const drawerWidth = 240; // Sidebar width

const QuestionsList = () => {
  const [matches, setMatches] = useState([]); // Store all matches
  const [selectedMatch, setSelectedMatch] = useState(""); // Store selected match
  const [questions, setQuestions] = useState([]); // Store questions for selected match
  const [selectedQuestion, setSelectedQuestion] = useState(""); // Store selected question

  // Fetch available matches on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches(); // Fetch matches from API
        console.log(data);
        
        setMatches(data);
      } catch (error) {
        console.error("Failed to load matches:", error);
      }
    };

    fetchMatches();
  }, []);

  // Fetch questions based on selected match
  useEffect(() => {
    if (!selectedMatch) return; // Skip if no match selected

    const fetchQuestions = async () => {
      try {
        const data = await getQuestions(selectedMatch); // Fetch questions for this match
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };

    fetchQuestions();
  }, [selectedMatch]);

  // Handle match selection change
  const handleMatchChange = (event) => {
    setSelectedMatch(event.target.value);
    setQuestions([]); // Clear previous questions
    setSelectedQuestion(""); // Reset selected question
  };

  // Handle user selecting a question
  const handleSelect = (event) => {
    setSelectedQuestion(event.target.value);
  };

  // Handle submitting the selected question
  const handleSubmit = () => {
    if (!selectedQuestion) {
      alert("Please select a question before submitting.");
      return;
    }
    console.log("Selected Question:", selectedQuestion);
    // Here you can perform an action like saving the selection
  };

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
          Select a Match
        </Typography>

        {/* Match Selection Dropdown */}
        <Select
          value={selectedMatch}
          onChange={handleMatchChange}
          displayEmpty
          fullWidth
          sx={{ marginBottom: 3 }}
        >
          <MenuItem value="" disabled>
            Choose a Match
          </MenuItem>
          {matches.map((match) => (
            <MenuItem key={match._id} value={match._id}>
              {match.matchName} {/* Assuming matches have a "name" field */}
            </MenuItem>
          ))}
        </Select>

        {/* Display Questions for Selected Match */}
        {selectedMatch && (
          <>
            <Typography variant="h6">Select a Question</Typography>

            <FormControl component="fieldset">
              <RadioGroup value={selectedQuestion} onChange={handleSelect}>
                {questions.map((q) => (
                  <Card
                    key={q._id}
                    sx={{
                      marginBottom: 2,
                      padding: 2,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      backgroundColor:
                        selectedQuestion === q._id ? "#e0f7fa" : "white",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{q.text}</Typography>
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                      <FormControlLabel
                        value={q._id}
                        control={<Radio />}
                        label="Select this question"
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginTop: 2 }}
            >
              Submit Selection
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default QuestionsList;
