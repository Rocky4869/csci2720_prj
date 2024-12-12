import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import { toast } from "react-toastify";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decodedToken = decodeToken(token);
      toast.success("Login successful");
      if (decodedToken && decodedToken.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      toast.error("Incorrect username or password");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(90deg, #4a00e0, #8e2de2, #f27121)",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", padding: 2 }}>
        <CardContent>
          <div className="flex flex-row items-center justify-center">
            <BiotechIcon sx={{ fontSize: 60 }} />
            <Typography
              variant="h4"
              component="div"
              fontWeight="bold"
              sx={{ fontSize: 30 }}
            >
              Cultural Scope
            </Typography>
          </div>
          <div className="mt-4 text-lg">Welcome to Cultural Scope</div>
          <div className="mb-1 text-sm mt-1">
            Explore Hong Kong unique cultural events
          </div>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                textTransform: "none",
                backgroundColor: "black",
                ":hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Sign In
            </Button>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Button
                component={Link}
                href="/register"
                variant="text"
                sx={{ textTransform: "none" }}
              >
                Register
              </Button>
              <Button
                component={Link}
                href="/"
                variant="text"
                sx={{ textTransform: "none" }}
              >
                Forgot password?
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
