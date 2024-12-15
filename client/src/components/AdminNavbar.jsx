import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Button, AppBar, Toolbar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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
    navigate("/login");
    toast.success("Logout successful");
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
            startIcon={<EventIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/admin")}
          >
            Events
          </Button>
          <Button
            color="inherit"
            startIcon={<PeopleIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => (window.location.href = "/admin-user")}
          >
            Users
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

export default AdminNavbar;
