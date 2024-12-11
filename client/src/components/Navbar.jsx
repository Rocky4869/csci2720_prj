import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Button, AppBar, Toolbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Navbar = () => {
  const [username, setUsername] = useState("");

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AppBar position="static">
      <Toolbar
        className="flex flex-row justify-between p-5"
        style={{
          background: "linear-gradient(90deg, #4a00e0, #8e2de2, #f27121)",
        }}
      >
        <div className="flex flex-row gap-10">
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
        <div className="flex flex-row items-center gap-10">
          <div>Welcome, {username}</div>
          <Button
            variant="contained"
            color="primary"
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
