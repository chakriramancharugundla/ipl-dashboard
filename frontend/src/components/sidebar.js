import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "primary.main", // Matches login button color
          color: "#fff", // White text for contrast
          position: "fixed", // Fixes sidebar position
          height: "100vh", // Full height
        },
      }}
    >
      <List>
        <ListItem button onClick={() => navigate("/home")}>
          <ListItemText primary="Home" sx={{ cursor: "pointer" }} />
        </ListItem>

        <ListItem button onClick={() => navigate("/userresponses")}>
          <ListItemText primary="My Dashboard" sx={{ cursor: "pointer" }} />
        </ListItem>

        <ListItem button onClick={() => navigate("/allresponses")}>
          <ListItemText primary="Leaderboard" sx={{ cursor: "pointer" }} />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" sx={{ cursor: "pointer" }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
