import React, { useState, useEffect } from "react";
import { 
  getMatches, 
  addMatch, 
  addQuestion, 
  updateCorrectAnswer, 
  updateCorrectnessForMatch,
  getQuestions 
} from "../api";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  Snackbar, 
  Card, 
  CardContent 
} from "@mui/material";

const AdminPanel = () => {
  const [matches, setMatches] = useState([]);
  const [matchName, setMatchName] = useState("");
  const [date, setDate] = useState("");
  const [matchTime, setMatchTime] = useState("");

  const [selectedMatchForQuestions, setSelectedMatchForQuestions] = useState("");
  const [selectedMatchForAnswerUpdate, setSelectedMatchForAnswerUpdate] = useState("");
  const [selectedMatchForCorrectness, setSelectedMatchForCorrectness] = useState("");

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [category, setCategory] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error("Failed to load matches", error);
      showSnackbar("Error loading matches");
    }
  };

  const fetchQuestionsForMatch = async (matchId) => {
    try {
      if (!matchId) return;
      const questions = await getQuestions(matchId);
      setQuestions(questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleAddMatch = async () => {
    if (!matchName || !date || !matchTime) {
      return alert("Please enter match name, date, and time.");
    }

    try {
      const dateTime = new Date(`${date}T${matchTime}`);
      dateTime.setHours(dateTime.getHours() + 5);
      dateTime.setMinutes(dateTime.getMinutes() + 30);
      const formattedDateTime = dateTime.toISOString();

      await addMatch({ matchName, date: formattedDateTime });
      fetchMatches();
      setMatchName("");
      setDate("");
      setMatchTime("");
      showSnackbar("Match added successfully!");
    } catch (error) {
      showSnackbar("Failed to add match");
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedMatchForQuestions || !questionText || !option1 || !option2 || !category) {
      return alert("Fill all fields");
    }

    try {
      await addQuestion(selectedMatchForQuestions, { text: questionText, options: [option1, option2], category });
      fetchQuestionsForMatch(selectedMatchForQuestions);
      setQuestionText("");
      setOption1("");
      setOption2("");
      setCategory("");
      showSnackbar("Question added successfully!");
    } catch (error) {
      showSnackbar("Failed to add question");
    }
  };

  const handleUpdateCorrectAnswer = async () => {
    if (!selectedMatchForAnswerUpdate || !selectedQuestion || !correctAnswer) {
      return alert("Select a match, question, and enter the correct answer.");
    }

    try {
      await updateCorrectAnswer(selectedQuestion, correctAnswer);
      setCorrectAnswer("");
      showSnackbar("Correct answer updated!");
    } catch (error) {
      showSnackbar("Failed to update correct answer");
    }
  };

  const handleUpdateResponseCorrectness = async () => {
    if (!selectedMatchForCorrectness) return alert("Select a match");

    try {
      await updateCorrectnessForMatch(selectedMatchForCorrectness);
      showSnackbar("Response correctness updated!");
    } catch (error) {
      showSnackbar("Failed to update response correctness");
    }
  };

  return (
    <Box display="flex" sx={{ backgroundColor: "#e3f2fd", minHeight: "100vh" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: "50px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>Admin Panel</Typography>

        {/* Add Match */}
        <Card sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Add Match</Typography>
            <TextField label="Match Name" value={matchName} onChange={(e) => setMatchName(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleAddMatch}>Add Match</Button>
          </CardContent>
        </Card>

        {/* Add Question */}
        <Card sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Add Question</Typography>
            <TextField select label="Select Match" value={selectedMatchForQuestions} onChange={(e) => { setSelectedMatchForQuestions(e.target.value); fetchQuestionsForMatch(e.target.value); }} fullWidth sx={{ mb: 2 }}>
              {matches.map((match) => (
                <MenuItem key={match._id} value={match._id}>{match.matchName}</MenuItem>
              ))}
            </TextField>
            <TextField label="Question Text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Option 1" value={option1} onChange={(e) => setOption1(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Option 2" value={option2} onChange={(e) => setOption2(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleAddQuestion}>Add Question</Button>
          </CardContent>
        </Card>

        {/* Update Correct Answer */}
        <Card sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Update Correct Answer</Typography>
            <TextField select label="Select Match" value={selectedMatchForAnswerUpdate} onChange={(e) => { setSelectedMatchForAnswerUpdate(e.target.value); fetchQuestionsForMatch(e.target.value); }} fullWidth sx={{ mb: 2 }}>
              {matches.map((match) => (
                <MenuItem key={match._id} value={match._id}>{match.matchName}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Select Question" value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)} fullWidth sx={{ mb: 2 }}>
              {questions.map((question) => (
                <MenuItem key={question._id} value={question._id}>{question.text}</MenuItem>
              ))}
            </TextField>
            <TextField label="Correct Answer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleUpdateCorrectAnswer}>Update Correct Answer</Button>
          </CardContent>
        </Card>
         {/* Update Response Correctness */}
         <Card sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Update Response Correctness</Typography>
            <TextField select label="Select Match" value={selectedMatchForCorrectness} onChange={(e) => setSelectedMatchForCorrectness(e.target.value)} fullWidth sx={{ mb: 2 }}>
              {matches.map((match) => (
                <MenuItem key={match._id} value={match._id}>{match.matchName}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleUpdateResponseCorrectness}>Update Correctness</Button>
          </CardContent>
        </Card>



        <Snackbar open={snackbarOpen} autoHideDuration={3000} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
      </Box>
    </Box>
  );
};

export default AdminPanel;
