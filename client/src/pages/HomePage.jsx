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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Icons for toggle button
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [favLocation, setFavLocation] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const { theme } = useTheme(); // Access the current theme

  const fetchData = async () => {
    try {
      const [locationsResponse, eventsResponse] = await Promise.all([
        axios.get("http://localhost:3000/locations"),
        axios.get("http://localhost:3000/events"),
      ]);

      const locations = locationsResponse.data;
      const events = eventsResponse.data;

      const updatedLocations = locations.map((location) => ({
        ...location,
        eventCount:
          events.filter((event) => event.venue === location._id).length || 0,
      }));

      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFavLocation();

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

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
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

  const handleAddFavorite = async (locationId) => {
    try {
      const isFav = favLocation.includes(locationId);

      const updatedFavLocation = isFav
        ? favLocation.filter((id) => id !== locationId)
        : [...favLocation, locationId];

      setFavLocation(updatedFavLocation);

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
    <div
      style={{
        backgroundColor: theme === "dark" ? "#121212" : "#F5F5F5",
        color: theme === "dark" ? "#FFFFFF" : "#000000",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Container>
        <div
          className="px-10 py-5 mt-10"
          style={{
            backgroundColor: theme === "dark" ? "#1E1E1E" : "white",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            >
              List of Locations
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: theme === "dark" ? "#B0B0B0" : "#6C6C6C",
                mb: 1, // Adds some margin below the text
              }}
            >
              Browse through the list of venues below. Use the filters to refine your search and find venues based on your preferences.
            </Typography>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="text"
              sx={{
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
              startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          <hr />
          {showFilters && ( // Conditionally render the filters
            <div className="grid grid-cols-4 gap-10 items-center">
              <FormControl fullWidth margin="normal">
                <Typography
                  gutterBottom
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Filter by Distance
                </Typography>
                <Slider
                  value={distance}
                  onChange={(e, newValue) => setDistance(newValue)}
                  aria-labelledby="distance-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Typography
                  id="distance-slider"
                  gutterBottom
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  {distance} km
                </Typography>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Typography
                  gutterBottom
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Filter by Category
                </Typography>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Filter by Category" }}
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                    backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
                  }}
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
                <Typography
                  gutterBottom
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Filter by Keyword
                </Typography>
                <TextField
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            color: theme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        />
                      </InputAdornment>
                    ),
                    style: {
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                    },
                  }}
                  sx={{
                    backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
                  }}
                />
              </FormControl>
            </div>
          )}
        </div>

        <Paper
          className="mt-5"
          style={{
            backgroundColor: theme === "dark" ? "#1E1E1E" : "white",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  <TableSortLabel
                    active
                    direction={sortOrder}
                    onClick={handleSort}
                    sx={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      "&.Mui-active": {
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      },
                    }}
                  >
                    Number of Events
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Favorite
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow
                  key={location.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#333333" : "#f0f0f0",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {location.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/locations/${location.id}`}
                      style={{
                        color: "#007BFF",
                      }}
                    >
                      {location.name}
                    </Link>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {location.eventCount}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleAddFavorite(location._id)}
                      color="warning"
                      sx={{
                        textTransform: "none",
                        backgroundColor: theme === "dark" ? "#333333" : "white",
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                        "&:hover": {
                          backgroundColor:
                            theme === "dark" ? "#444444" : "#f0f0f0",
                        },
                      }}
                    >
                      {favLocation.includes(location._id)
                        ? "Remove from Favorite"
                        : "Add to Favorite"}
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

