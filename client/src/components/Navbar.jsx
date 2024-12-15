import React, { useState, useEffect } from "react";
import { Button, AppBar, Toolbar, Typography, Switch, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { jwtDecode } from "jwt-decode"; // Corrected named import
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Decode the token and get the username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Correct usage of jwtDecode
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
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: theme === "dark"
          ? "linear-gradient(90deg, #333, #444, #555)"
          : "linear-gradient(90deg, #4a00e0, #8e2de2, #f27121)",
        transition: "background 0.3s ease",
      }}
    >
      <Toolbar className="flex flex-row justify-between p-5">
        {/* Left Section - Navigation Buttons */}
        <div className="flex flex-row gap-4">
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/home")}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<EventIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/event")}
          >
            Event
          </Button>
          <Button
            color="inherit"
            startIcon={<MapIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/map")}
          >
            Map
          </Button>
          <Button
            color="inherit"
            startIcon={<FavoriteIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/favorite")}
          >
            Favorite
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
            }}
          >
            Welcome, {username || "Guest"}
          </Typography>

          {/* Logout Button */}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              backgroundColor: "white",
              color: "black",
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

export default Navbar;