import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Slider,
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const fetchData = async () => {
    try {
      const [locationsResponse, eventsResponse] = await Promise.all([
        axios.get("http://localhost:3000/locations"),
        axios.get("http://localhost:3000/events"),
      ]);

      const locations = locationsResponse.data;
      const eventCountMap = eventsResponse.data;
      const updatedLocations = locations.map((location) => ({
        ...location,
        eventCount:
          eventCountMap.filter((event) => event.venue === location._id)
            .length || 0,
      }));

      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    let filtered = locations;

    if (distance && currentLocation.latitude && currentLocation.longitude) {
      filtered = filtered.filter(
        (location) =>
          haversineDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            location.latitude,
            location.longitude
          ) <= distance
      );
    }

    if (category) {
      filtered = filtered.filter((location) =>
        location.name.includes(category)
      );
    }

    if (keyword) {
      filtered = filtered.filter((location) =>
        location.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  }, [distance, category, keyword, locations]);

  const handleAddFavorite = (locationId) => {
    console.log("Add favorite for location:", locationId);
  };

  const handleSort = () => {
    const sorted = [...filteredLocations].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.eventCount - b.eventCount;
      } else {
        return b.eventCount - a.eventCount;
      }
    });
    setFilteredLocations(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <Navbar />

      <Container>
        <div className="px-10 py-5 mt-10" style={{ backgroundColor: "white" }}>
          <Typography variant="h5" gutterBottom>
            List of Locations
          </Typography>
          <hr />
          <div className="grid grid-cols-4 gap-10 items-center">
            <FormControl fullWidth margin="normal">
              <Typography gutterBottom>Filter by Distance</Typography>
              <Slider
                value={distance}
                onChange={(e, newValue) => setDistance(newValue)}
                aria-labelledby="distance-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
              <Typography id="distance-slider" gutterBottom>
                {distance} km
              </Typography>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography gutterBottom>Filter by Category</Typography>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Filter by Category" }}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Auditorium">Auditorium</MenuItem>
                <MenuItem value="Function Room">Function Room</MenuItem>
                <MenuItem value="Cultural Activities Hall">
                  Cultural Activities Hall
                </MenuItem>
                <MenuItem value="Exhibition Gallery">
                  Exhibition Gallery
                </MenuItem>
                <MenuItem value="Dance Studio">Dance Studio</MenuItem>
                <MenuItem value="Lecture Room">Lecture Room</MenuItem>
                <MenuItem value="Conference Room">Conference Room</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography gutterBottom>Filter by Keyword</Typography>
              <TextField
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </div>
        </div>
        <Paper className="mt-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>
                  <TableSortLabel
                    active
                    direction={sortOrder}
                    onClick={handleSort}
                  >
                    Number of Events
                  </TableSortLabel>
                </TableCell>
                <TableCell>Favorite</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.id}</TableCell>
                  <TableCell>
                    <Link to={`/locations/${location.id}`}>
                      {location.name}
                    </Link>
                  </TableCell>
                  <TableCell>{location.eventCount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddFavorite(location.id)}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "white",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
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
    </div>
  );
};

export default HomePage;
