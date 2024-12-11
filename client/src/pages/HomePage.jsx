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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFavorite = (locationId) => {
    console.log("Add favorite for location:", locationId);
  };

  const handleFilter = () => {
    let filtered = locations;

    if (distance) {
      // Assuming each location has a distance property
      filtered = filtered.filter((location) => location.distance <= distance);
    }

    if (category) {
      filtered = filtered.filter((location) => location.category === category);
    }

    if (keyword) {
      filtered = filtered.filter((location) =>
        location.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
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
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography gutterBottom>Filter by Category</Typography>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Category1">Category1</MenuItem>
                <MenuItem value="Category2">Category2</MenuItem>
                <MenuItem value="Category3">Category3</MenuItem>
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
