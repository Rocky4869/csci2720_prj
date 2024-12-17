import React, { useState, useEffect } from "react";
import { Button, AppBar, Toolbar, Typography, Switch, Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Corrected named import
import { useTheme } from "../contexts/ThemeContext";

const AdminNavbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Decode the token and get the username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.username) {
          setUsername(decodedToken.username);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: theme === "dark"
          ? "linear-gradient(90deg, #333, #444, #555)" // Dark theme gradient
          : "linear-gradient(90deg, #4a00e0, #8e2de2, #f27121)", // Light theme gradient
        transition: "background 0.3s ease",
      }}
    >
      <Toolbar className="flex flex-row justify-between p-5">
        {/* Left Section - Navigation Buttons */}
        <div className="flex flex-row gap-4">
          <Button
            color="inherit"
            startIcon={<EventIcon />}
            sx={{ textTransform: "none", fontWeight: 500 }}
            onClick={() => (window.location.href = "/admin")}
          >
            Events
          </Button>
          <Button
            color="inherit"
            startIcon={<PeopleIcon />}
            sx={{ textTransform: "none", fontWeight: 500 }}
            onClick={() => (window.location.href = "/admin-user")}
          >
            Users
          </Button>
        </div>

        {/* Right Section - Theme Toggle, Welcome Text, Logout */}
        <div className="flex flex-row items-center gap-6">
          {/* Theme Toggle */}
          <Box display="flex" alignItems="center">
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              color="default"
              inputProps={{ "aria-label": "theme toggle" }}
            />
            <Typography
              sx={{
                color: "white",
                marginLeft: 1,
                fontSize: "0.9rem",
              }}
            >
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </Typography>
          </Box>

          {/* Welcome Message */}
          <Typography
            sx={{
              color: "white",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Welcome, {username || "Admin"}
          </Typography>

          {/* Logout Button */}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              backgroundColor: "white",
              color: "black",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;