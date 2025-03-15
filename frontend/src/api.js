import axios from "axios";

const API_URL = "http://localhost:5000"; // Change if needed

// ✅ Centralized Token Management
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User not logged in!");
    window.location.href = "/login"; // Redirect to login page
    return null;
  }

  return { Authorization: `Bearer ${token}` };
};

// ✅ Generic function to handle API errors
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  throw error.response?.data || { error: defaultMessage };
};

// 🔹 **User Authentication APIs**
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response;
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Registration failed");
  }
};

// 🔹 **Team APIs**
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/teams/create`, teamData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to create team");
  }
};

export const joinTeam = async (teamId) => {
  try {
    const response = await axios.post(`${API_URL}/teams/join/${teamId}`, {}, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to join team");
  }
};

// 🔹 **Match APIs**
export const getMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch matches");
  }
};

export const addMatch = async (matchData) => {
  try {
    const response = await axios.post(`${API_URL}/matches`, matchData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to add match");
  }
};

// 🔹 **Question APIs**
export const getQuestions = async (matchId) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${matchId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch questions");
  }
};

export const addQuestion = async (matchId, questionData) => {
  try {
    const response = await axios.post(`${API_URL}/questions/${matchId}`, questionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to add question");
  }
};

export const updateCorrectAnswer = async (questionId, correctAnswer) => {
  try {
    const response = await axios.put(
      `${API_URL}/questions/update-answer/${questionId}`,
      { correctAnswer },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update correct answer");
  }
};

export const updateCorrectnessForMatch = async (matchId) => {
  console.log(matchId);
  
  try {
    const response = await axios.put(`${API_URL}/responses/update-correctness/${matchId}`, {}, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update response correctness");
  }
};

// 🔹 **Dashboard API**
export const getDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch dashboard data");
  }
};

// 🔹 **Response APIs**
export const submitResponse = async (data) => {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const response = await axios.post(`${API_URL}/responses`, data, { headers });
    return response.data;
  } catch (error) {
    alert(error.response?.data?.error || "Failed to submit response. Please try again.");
    return handleApiError(error, "Failed to submit response");
  }
};

export const getAllResponses = async () => {
  try {
    const response = await axios.get(`${API_URL}/responses/all-responses`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch responses");
  }
};
