import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TableSortLabel,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Slider,
  InputAdornment,
} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const FavoritePage = () => {
  const [favorite, setFavorite] = useState([]);
  const [favoriteArr, setFavoriteArr] = useState([]);

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //for fav button
  const fetchFavLocation = async () => {
    try {
      const response = await axios.get("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const favoriteArr = response.data;

      // Extract _id values into a new array
      const idsArray = favoriteArr.map(location => location._id);

      // Output or use the idsArray as needed
      console.log(idsArray);
      setFavoriteArr(favoriteArr);
      const favLocation = response.data;

      setFavorite(favLocation);
    } catch (err) {
      console.error(err);
    }
  };

  //for events
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

  const handleFav = async (locationId) => {
    try {
      const isFav = favorite[locationId];
      const updatedFavLocation = { ...favorite, [locationId]: !isFav };
      console.log(updatedFavLocation);
      setFavorite(updatedFavLocation);

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

  useEffect(() => {
    let filtered = locations;
     setFilteredLocations(filtered);
  }, [ locations]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <div className="mt-10">
          <div style={{ backgroundColor: "white" }}>
            <Typography variant="h5" gutterBottom>
              Favorite Locations
            </Typography>
          </div>

          <TableContainer component={Paper}>
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
                      Number of events
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favoriteArr
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((location) => (
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
                          sx={{
                            textTransform: "none",
                            backgroundColor: "white",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                          onClick={() => handleFav(location._id)}
                        >
                          {favorite[location._id]
                            ? "Add to Favorite"
                            : " Remove Favorite"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={favoriteArr.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </Container>
    </div>
  );
};

export default FavoritePage;
