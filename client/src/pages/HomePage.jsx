import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
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
} from "@mui/material";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [username, setUsername] = useState("User");

  const fetchData = async () => {
    try {
      const [locationsResponse, eventsResponse] = await Promise.all([
        axios.get("http://localhost:3000/locations"),
        axios.get("http://localhost:3000/events"),
      ]);

      const locations = locationsResponse.data;
      const eventCountMap = eventsResponse.data;
      console.log(locations);
      console.log(eventCountMap);
      const updatedLocations = locations.map((location) => ({
        ...location,
        eventCount:
          eventCountMap.filter((event) => event.venue === location._id)
            .length || 0,
      }));

      setLocations(updatedLocations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    console.log("Logout");
  };

  const handleAddFavorite = (locationId) => {
    console.log("Add favorite for location:", locationId);
  };

  return (
    <>
      <nav className="flex flex-row justify-between p-5">
        <div className="flex flex-row gap-10">
          <div>Home</div>
          <div>Event</div>
          <div>Venue</div>
          <div>Map</div>
          <div>Favorite</div>
        </div>
        <div className="flex flex-row items-center">
          <div className="mr-5">Welcome, {username}</div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </div>
      </nav>
      <Container>
        <Typography variant="h5" gutterBottom>
          List of Locations
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Number of Events</TableCell>
                <TableCell>Favorite</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.id}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.eventCount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddFavorite(location.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Add to Favorite
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default HomePage;
