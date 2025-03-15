import axios from "axios";

const API_URL = "http://localhost:5000"; // Change this if needed

// Helper function to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User not logged in!");
    window.location.href = "/login"; // Redirect to login page
    return null;
  }

  return { Authorization: `Bearer ${token}` };
};


// 🔹 User Authentication APIs
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log(response);
    
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error.response?.data || { error: "Login failed" };
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error.response?.data || { error: "Registration failed" };
  }
};

// 🔹 Team APIs
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/teams/create`, teamData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create team:", error);
    throw error.response?.data || { error: "Failed to create team" };
  }
};

export const joinTeam = async (teamId) => {
  try {
    const response = await axios.post(
      `${API_URL}/teams/join/${teamId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to join team:", error);
    throw error.response?.data || { error: "Failed to join team" };
  }
};

// 🔹 Match APIs
export const getMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    throw error.response?.data || { error: "Failed to fetch matches" };
  }
};

// 🔹 Question APIs
export const getQuestions = async (matchId) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${matchId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error.response?.data || { error: "Failed to fetch questions" };
  }
};

export const addQuestion = async (matchId, questionData) => {
  try {
    const response = await axios.post(`${API_URL}/questions/${matchId}`, questionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add question:", error);
    throw error.response?.data || { error: "Failed to add question" };
  }
};


// 🔹 Dashboard API
export const getDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error.response?.data || { error: "Failed to fetch dashboard data" };
  }
};


export const submitResponse = async (data) => {
  const headers = getAuthHeaders(); // Retrieve authentication headers

  if (!headers.Authorization) {
    alert("User not logged in!");
    window.location.href = "/login"; // Redirect to login if not authenticated
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/responses`, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Failed to submit response:", error);

    // Display appropriate error messages
    alert(error.response?.data?.error || "Failed to submit response. Please try again.");

    throw error.response?.data || { error: "Failed to submit response" };
  }
};



// Fetch all responses from the backend
export const getAllResponses = async () => {
  try {
    const response = await axios.get(`${API_URL}/responses/all-responses`, {
      headers: getAuthHeaders(),
    });
    return response.data;  // The populated responses
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    throw error.response?.data || { error: "Failed to fetch responses" };
  }
};