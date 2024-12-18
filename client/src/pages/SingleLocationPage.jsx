import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext"; // Import theme context

const SingleLocationPage = () => {
  const { id } = useParams(); // Get location ID from the URL
  const [location, setLocation] = useState(null); // Location details
  const [comments, setComments] = useState([]); // List of comments for the location
  const [newComment, setNewComment] = useState(""); // New comment text
  const [isFavorite, setIsFavorite] = useState(false); // Favorite status
  const [error, setError] = useState(""); // Error message for comment submission
  const [username, setUsername] = useState(""); // Logged-in username

  const { theme } = useTheme(); // Access the current theme
  const [favorite, setFavorite] = useState([]);
  const [favoriteArr, setFavoriteArr] = useState([]);

  const [locations, setLocations] = useState([]);
  const [favLocation, setFavLocation] = useState([]);
 

  // Function to decode token and extract the username
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

  // Fetch username from the token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.username) {
        setUsername(decodedToken.username); // Set the logged-in username
      }
    }
  }, []);

  // Fetch location details and comments
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Fetch location data by ID
        const locationResponse = await fetch(
          `http://localhost:3000/locations/${id}`
        );
        const locationData = await locationResponse.json();
        setLocation(locationData);

        // Fetch comments for the location
        const commentsResponse = await fetch(
          `http://localhost:3000/comments?locationId=${id}`
        );
        const commentsData = await commentsResponse.json();

        // Sort comments by `createdAt` in ascending order
        const sortedComments = commentsData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setComments(sortedComments);
      } catch (err) {
        console.error("Error fetching location or comments:", err);
      }
    };

    fetchLocationData();
  }, [id]);

  const fetchFavLocation = async () => {
    try {
      const response = await axios.get("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const favLocation = response.data.reduce(
        (acc, location) => [...acc, location._id],
        []
      );
      setFavLocation(favLocation);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFavorite = async (locationId) => {
    try {
      // Check if the location is already in the favorites array
      const isFav = favLocation.includes(locationId);

      // Update the favorites state
      const updatedFavLocation = isFav
        ? favLocation.filter((id) => id !== locationId) // Remove from favorites
        : [...favLocation, locationId]; // Add to favorites

      setFavLocation(updatedFavLocation);

      // Send the request to the server (as earlier)
      await axios.post(
        `http://localhost:3000/favorites/${locationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavLocation();
  }, []);

  // Handle adding a new comment
  const handleAddComment = async () => {
    // Validate input
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: id, text: newComment, username }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();

      // Add the new comment to the array and sort again
      const updatedComments = [...comments, newCommentData].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComments(updatedComments); // Update the comments list
      setNewComment(""); // Clear the comment input
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  // Show loading state if location data is not yet loaded
  if (!location) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#121212" : "#F5F5F5",
        color: theme === "dark" ? "#FFFFFF" : "#000000",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Container sx={{ py: 4 }}>
        {/* Location Title Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {location.name}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme === "dark" ? "#B0B0B0" : "#6C6C6C",
            }}
          >
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Typography>

          {/* Add to Favorite Button */}
          <Button
            variant="contained"
            onClick={() => handleAddFavorite(location._id)}
            color="warning"
            sx={{
              textTransform: "none",
              backgroundColor: theme === "dark" ? "#555555" : "#FFFFFF",
              color: theme === "dark" ? "#FFFFFF" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#666666" : "#F0F0F0",
              },
            }}
          >
            {favLocation.includes(location._id) ? "Remove from Favorite" : "Add to Favorite"}
          </Button>
        </Paper>

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                minHeight: "450px",
                backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Location Map
              </Typography>
              <iframe
                title="Google Map"
                width="100%"
                height="400px"
                frameBorder="0"
                style={{ border: "0", borderRadius: "8px" }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA4hW_b2rqgbjY2srwHM2A-wZpAQ9y-DJo&q=${encodeURIComponent(
                  location.name.replace(/\s*\(.*?\)\s*/g, "").trim()
                )}`}
                allowFullScreen
              ></iframe>
            </Paper>
          </Grid>

          {/* Comments Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                minHeight: "450px",
                backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>

              {/* Comments Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      Username
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      Comment
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <TableRow key={comment._id || index}>
                        <TableCell
                          sx={{
                            color: theme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {comment.username}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {comment.text.split("\n").map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{
                          color: theme === "dark" ? "#FFFFFF" : "#000000",
                        }}
                      >
                        No Comments
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Error Message */}
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              {/* Add Comment Form */}
              <TextField
                label="Add a Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{
                  mt: 2,
                  backgroundColor: theme === "dark" ? "#555555" : "#FFFFFF",
                  "& .MuiInputBase-root": {
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  backgroundColor: theme === "dark" ? "#555555" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  "&:hover": {
                    backgroundColor: theme === "dark" ? "#666666" : "#F0F0F0",
                  },
                }}
              >
                Submit
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SingleLocationPage;
