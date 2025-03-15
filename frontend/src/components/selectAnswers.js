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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "./sidebar";

const drawerWidth = 240;

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

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    console.log("Re-render triggered:", questionsExpiredByMatch);
  }, [questionsExpiredByMatch]);

  // Fetch matches, questions, and responses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMatches = await getMatches();
        const nowUTC = new Date();
        const todayUTC = nowUTC.toISOString().split("T")[0];

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
          //const matchDateTimeUTC = new Date(match.date);
          
          
          const matchDateTimeUTC = new Date(match.date).toUTCString();
        
           
          const matchDateTime = new Date(matchDateTimeUTC); 

          

          
                      
            const thirtyMinutesBeforeMatchUTC = new Date(matchDateTime.getTime() - 360 * 60000);
            console.log("22",thirtyMinutesBeforeMatchUTC);
            console.log("11",nowUTC);
            
            

          if (nowUTC >= thirtyMinutesBeforeMatchUTC) {
            console.log(match.matchName);
            console.log(match._id);
            
            updatedQuestionsExpiredByMatch[match._id] = true;
            console.log(updatedQuestionsExpiredByMatch[match._id]);


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

  // Handle selecting an answer for a specific match
  const handleAnswerSelect = (matchId, questionId, selectedOption) => {
    setResponsesByMatch((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [questionId]: selectedOption,
      },
    }));
  };

  // Handle form submission for a specific match
  const handleSubmit = async (matchId) => {
    if (!user?._id) {
      alert("User not logged in!");
      return;
    }

    const matchQuestions = questionsByMatch[matchId] || [];
    const userResponses = responsesByMatch[matchId] || {};

    // Ensure all questions are answered
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
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Typography variant="h5" gutterBottom>Today's Matches</Typography>

        {loadingData ? (
          <Typography>Loading...</Typography>
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <Accordion key={match._id} sx={{ marginBottom: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{match.matchName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Match Time (IST): {new Date(match.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </Typography>

                {questionsExpiredByMatch[match._id] ? (
                  <Typography sx={{ color: "red", marginTop: 2 }}>
                    Questions are no longer available (Match starting soon).
                  </Typography>
                ) : questionsByMatch[match._id]?.length > 0 ? (
                  <>
                    {questionsByMatch[match._id].map((q) => (
                      <Card key={q._id} sx={{ marginBottom: 2, padding: 2, borderRadius: 2 }}>
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit(match._id)}
                      sx={{ marginTop: 2 }}
                      disabled={userResponsesByMatch[match._id]}
                    >
                      {userResponsesByMatch[match._id] ? "Responses Submitted" : "Submit Answers"}
                    </Button>
                  </>
                ) : (
                  <Typography>No questions available.</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography>No matches available today.</Typography>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          message="Responses submitted successfully!"
          onClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default SelectAnswers;
