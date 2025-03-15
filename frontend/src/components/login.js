import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api"; // Ensure this function works correctly
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      const response = await loginUser(credentials);
      console.log("API Response:", response);

      if (response?.status === 200 && response.data.token) {
        const userData = {
          token: response.data.token,
          username: response.data.username, // Ensure your backend sends this
          _id: response.data.userId, // Ensure your backend sends this
        };
        console.log("userData: ",userData);
        
        login(userData); // Save user to AuthContext
        console.log("Navigating to /home...");
        navigate("/home");
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        console.error("Error Response Data:", err.response.data);
        setError(err.response.data.message || "Invalid username or password");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Card sx={{ width: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
