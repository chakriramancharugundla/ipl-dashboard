import React from "react";
import Sidebar from "./sidebar";
import { Box, Typography } from "@mui/material";

const Home = () => {
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
          ml: "250px", // Offset the sidebar width
        }}
      >
        <Typography variant="h4">Welcome to the Dashboard</Typography>
        <Typography variant="body1">This is the main content area.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
