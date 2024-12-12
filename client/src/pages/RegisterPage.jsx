import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Link,
  Typography,
} from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format. Please try again.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match, please try again.");
        return;
      }
      const res = await axios.post("http://localhost:3000/auth/register", {
        username,
        password,
        email,
      });
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Email or username already exists. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
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
          <form onSubmit={handleRegister}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
              Register
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
