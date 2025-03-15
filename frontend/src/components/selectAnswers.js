import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches, getQuestions, submitResponse, getAllResponses } from "../api";
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
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "./sidebar";

const drawerWidth = 50;

const SelectAnswers = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [questionsByMatch, setQuestionsByMatch] = useState({});
  const [responsesByMatch, setResponsesByMatch] = useState({});
  const [userResponsesByMatch, setUserResponsesByMatch] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [questionsExpiredByMatch, setQuestionsExpiredByMatch] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMatches = await getMatches();
        const nowUTC = new Date();
        const todayUTC = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];

        const todayMatches = allMatches.filter(
          (m) => new Date(m.date).toISOString().split("T")[0] === todayUTC
        );

        if (todayMatches.length === 0) {
          setLoadingData(false);
          return;
        }

        setMatches(todayMatches);

        const allResponses = await getAllResponses();
        const updatedQuestionsByMatch = {};
        const updatedResponsesByMatch = {};
        const updatedUserResponsesByMatch = {};
        const updatedQuestionsExpiredByMatch = {};

        for (const match of todayMatches) {
          const matchDateTimeUTC = new Date(match.date).toUTCString();
          const matchDateTime = new Date(matchDateTimeUTC);
          const thirtyMinutesBeforeMatchUTC = new Date(matchDateTime.getTime() - 360 * 60000);

          if (nowUTC >= thirtyMinutesBeforeMatchUTC) {
            updatedQuestionsExpiredByMatch[match._id] = true;
            continue;
          }

          const matchQuestions = await getQuestions(match._id);
          updatedQuestionsByMatch[match._id] = matchQuestions;

          const userResponses = allResponses.filter(
            (resp) => resp.userId._id === user._id && resp.matchId._id === match._id
          );

          if (userResponses.length > 0) {
            updatedUserResponsesByMatch[match._id] = true;
            const prefilledResponses = {};
            userResponses.forEach((resp) => {
              prefilledResponses[resp.questionId] = resp.selectedOption;
            });

            updatedResponsesByMatch[match._id] = prefilledResponses;
          } else {
            updatedUserResponsesByMatch[match._id] = false;
          }
        }

        setQuestionsByMatch(updatedQuestionsByMatch);
        setResponsesByMatch(updatedResponsesByMatch);
        setUserResponsesByMatch(updatedUserResponsesByMatch);
        setQuestionsExpiredByMatch((prev) => ({ ...prev, ...updatedQuestionsExpiredByMatch }));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAnswerSelect = (matchId, questionId, selectedOption) => {
    setResponsesByMatch((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [questionId]: selectedOption,
      },
    }));
  };

  const handleSubmit = async (matchId) => {
    if (!user?._id) {
      alert("User not logged in!");
      return;
    }

    const matchQuestions = questionsByMatch[matchId] || [];
    const userResponses = responsesByMatch[matchId] || {};

    if (matchQuestions.length === 0 || Object.keys(userResponses).length !== matchQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const responseArray = matchQuestions.map((q) => ({
      userId: user._id,
      matchId,
      questionId: q._id,
      selectedOption: userResponses[q._id],
    }));

    try {
      await Promise.all(responseArray.map((response) => submitResponse(response)));
      setSnackbarOpen(true);
      setUserResponsesByMatch((prev) => ({
        ...prev,
        [matchId]: true,
      }));
    } catch (error) {
      console.error("Failed to submit responses:", error);
      alert("Failed to submit responses. Please try again.");
    }
  };

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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Matches Available
        </Typography>

        {loadingData ? (
          <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <Accordion
              key={match._id}
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                marginBottom: 2,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f1f8ff" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ color: "#000" }}>{match.matchName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper elevation={3} sx={{ p: 2, borderRadius: "8px" }}>
                  {questionsExpiredByMatch[match._id] ? (
                    <Typography sx={{ color: "red", textAlign: "center" }}>
                      Questions are no longer available (Match starting soon).
                    </Typography>
                  ) : questionsByMatch[match._id]?.length > 0 ? (
                    <>
                      {questionsByMatch[match._id].map((q) => (
                        <Card key={q._id} sx={{ mb: 2, p: 2, borderRadius: "8px" }}>
                          <CardContent>
                            <Typography variant="h6">{q.text}</Typography>
                            <FormControl component="fieldset">
                              <RadioGroup
                                value={responsesByMatch[match._id]?.[q._id] || ""}
                                onChange={(e) => handleAnswerSelect(match._id, q._id, e.target.value)}
                                disabled={userResponsesByMatch[match._id]}
                              >
                                {q.options.map((opt, i) => (
                                  <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </CardContent>
                        </Card>
                      ))}
                      <Button variant="contained" onClick={() => handleSubmit(match._id)} disabled={userResponsesByMatch[match._id]}>
                        {userResponsesByMatch[match._id] ? "Responses Submitted" : "Submit Answers"}
                      </Button>
                    </>
                  ) : (
                    <Typography>No questions available.</Typography>
                  )}
                </Paper>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography>No matches available today.</Typography>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} message="Responses submitted successfully!" onClose={() => setSnackbarOpen(false)} />
      </Box>
    </Box>
  );
};

export default SelectAnswers;
