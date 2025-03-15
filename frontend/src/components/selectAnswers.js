import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches, getQuestions, submitResponse } from "../api";
import { useAuth } from "../context/AuthContext";
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
} from "@mui/material";
import Sidebar from "./sidebar";

const drawerWidth = 240;

const SelectAnswers = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [todayMatch, setTodayMatch] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [questionsExpired, setQuestionsExpired] = useState(false);

  // ✅ Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // ✅ Fetch today's match & questions (only if before 30 mins of match time)
  useEffect(() => {
    const fetchTodayMatch = async () => {
      try {
        const matches = await getMatches();
        const now = new Date();
        const today = now.toISOString().split("T")[0]; // Format YYYY-MM-DD

        // Find today's match
        const match = matches.find((m) => m.date?.split("T")[0] === today);

        if (match) {
          setTodayMatch(match);
          
          // Convert match time to Date object
          const matchDateTime = new Date(match.date);
          const thirtyMinutesBeforeMatch = new Date(matchDateTime.getTime() - 30 * 60000);

          // Check if it's within 30 minutes of match start
          if (now >= thirtyMinutesBeforeMatch) {
            setQuestionsExpired(true);
          } else {
            const matchQuestions = await getQuestions(match._id);
            setQuestions(matchQuestions);
          }
        } else {
          setTodayMatch(null);
        }
      } catch (error) {
        console.error("Failed to load match/questions:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchTodayMatch();
  }, []);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      alert("User not logged in!");
      return;
    }

    const responseArray = Object.entries(responses).map(([questionId, selectedOption]) => ({
      userId: user._id,
      matchId: todayMatch._id,
      questionId,
      selectedOption,
    }));

    try {
      await Promise.all(responseArray.map((response) => submitResponse(response)));
      alert("Responses submitted successfully!");
    } catch (error) {
      console.error("Failed to submit responses:", error);
      alert("Failed to submit responses. Please try again.");
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Typography variant="h5" gutterBottom>Today's Match</Typography>

        {loadingData ? (
          <Typography>Loading...</Typography>
        ) : todayMatch ? (
          <>
            <Typography variant="h6">
              {todayMatch.matchName} - {new Date(todayMatch.date).toLocaleString()}
            </Typography>

            {questionsExpired ? (
              <Typography sx={{ color: "red" }}>Questions are no longer available (Match starting soon).</Typography>
            ) : questions.length > 0 ? (
              <>
                <Typography variant="h6" sx={{ marginTop: 2 }}>Answer the Questions</Typography>
                {questions.map((q) => (
                  <Card key={q._id} sx={{ marginBottom: 2, padding: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{q.text}</Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={responses[q._id] || ""}
                          onChange={(e) => handleAnswerSelect(q._id, e.target.value)}
                        >
                          {q.options.map((opt, i) => (
                            <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
                  Submit Answers
                </Button>
              </>
            ) : (
              <Typography>No questions available.</Typography>
            )}
          </>
        ) : (
          <Typography>No match available today.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SelectAnswers;
