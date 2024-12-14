import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  InputAdornment,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../components/Navbar";

const SingleLocationPage = () => {
  const { id } = useParams(); // Get location ID from the URL
  const [location, setLocation] = useState(null); // Location details
  const [comments, setComments] = useState([]); // Comments for the location
  const [newComment, setNewComment] = useState(""); // New comment input
  const [isFavorite, setIsFavorite] = useState(false); // Favorite status

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
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching location or comments:", err);
      }
    };

    fetchLocationData();
  }, [id]);

  // Handle adding/removing from favorites
  const handleAddToFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:3000/favorites`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: id }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite); // Toggle favorite status
      } else {
        console.error("Error updating favorite status");
      }
    } catch (err) {
      console.error("Error adding to favorites:", err);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: id, text: newComment }),
      });

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]); // Update comments list
      setNewComment(""); // Clear input field
    } catch (err) {
      console.error("Error adding comment:", err);
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
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <Navbar />

      <Container sx={{ py: 4 }}>
        {/* Location Title Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {location.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Typography>

          {/* Add to Favorite Button */}
          <Button
            variant="contained"
            onClick={handleAddToFavorite}
            sx={{
              mt: 2,
              textTransform: "none",
              backgroundColor: "#FFFFFF", // White background
              color: "#000000", // Black text
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow
              borderRadius: "8px", // Rounded corners
              "&:hover": {
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Slightly increased shadow on hover
                backgroundColor: "#f9f9f9", // Slightly darker white
              },
            }}
          >
            {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
          </Button>
        </Paper>

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: "450px" }}>
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
            <Paper sx={{ p: 3, minHeight: "450px" }}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>

              {/* Comments Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{comment.text}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No Comments
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Add Comment */}
              <TextField
                label="Add a Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  backgroundColor: "#FFFFFF", // White background
                  color: "#000000", // Black text
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow
                  borderRadius: "8px", // Rounded corners
                  "&:hover": {
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Slightly increased shadow on hover
                    backgroundColor: "#f9f9f9", // Slightly darker white
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