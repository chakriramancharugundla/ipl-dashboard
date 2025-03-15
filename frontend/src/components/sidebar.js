import React from "react";
import { Drawer, List, ListItem,  ListItemText } from "@mui/material";

import { useNavigate } from "react-router-dom";

const drawerWidth = 240; // Ensure consistent width

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
        },
      }}
    >
      <List>
        <ListItem button onClick={() => navigate("/questionslist")}>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button onClick={() => navigate("/userresponses")}>
          <ListItemText primary="My Dashboard" />
        </ListItem>

        <ListItem button onClick={() => navigate("/allresponses")}>
          <ListItemText primary="Leaderboard" />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
