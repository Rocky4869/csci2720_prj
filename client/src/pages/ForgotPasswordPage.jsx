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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/forgot-password",
        {
          email,
        }
      );
      toast.success("Password reset link sent to your email.");
      navigate("/login");
    } catch (err) {
      toast.error("An error occurred. Please try again.");
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
          <div className="mt-4 text-lg">Forgot Password</div>
          <div className="mb-1 text-sm mt-1">
            Enter your email to receive a password reset link.
          </div>
          <form onSubmit={handleForgotPassword}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Send Reset Link
            </Button>
            <Button
              component={Link}
              href="/login"
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

export default ForgotPasswordPage;
