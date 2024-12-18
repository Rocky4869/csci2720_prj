import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { toast } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext"; // Import theme context for light/dark mode

const EventPage = () => {
  const { theme } = useTheme(); // Access the current theme (light or dark)
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterLiked, setFilterLiked] = useState("all");
  const [filterPrice, setFilterPrice] = useState(0);
  const [bookedEvents, setBookedEvents] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const location = useLocation();
  // Fetch events and related data
  const fetchData = async () => {
    try {
      const [locationsResponse, eventsResponse] = await Promise.all([
        axios.get("http://localhost:3000/locations"),
        axios.get("http://localhost:3000/events"),
      ]);

      const locations = locationsResponse.data;
      const events = eventsResponse.data;
      
      const updatedEvents = events.map((event) => ({
        ...event,
        venue: locations.find((location) => location._id === event.venue).name,
        likeCount: event.likeCount || 0, // Initialize likeCount
      }));
      setEvents(updatedEvents);
    } catch (err) {
      console.error(err);
    }
  };
  
  const updateLikeCount = (eventId, increment) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId
          ? { ...event, likeCount: event.likeCount + increment }
          : event
      )
    );
  };

  // Fetch liked events by the user
  const fetchLikedEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/likes/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const likedEvents = response.data.reduce((acc, event) => {
        acc[event._id] = true;
        return acc;
      }, {});
      setLikedEvents(likedEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch booked events by the user
  const fetchBookedEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/bookings/events",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const bookedEvents = response.data.reduce((acc, event) => {
        acc[event._id] = true;
        return acc;
      }, {});
      setBookedEvents(bookedEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle liking/unliking events
  const handleLike = async (eventId) => {
    try {
      const isLiked = likedEvents[eventId];
      const updatedLikedEvents = { ...likedEvents, [eventId]: !isLiked };
      setLikedEvents(updatedLikedEvents);

      updateLikeCount(eventId, isLiked ? -1 : 1);

      await axios.post(
        `http://localhost:3000/likes/${eventId}`,
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

  // Handle booking/canceling events
  const handleBook = async (eventId) => {
    try {
      const isBooked = bookedEvents[eventId];
      const updatedBookedEvents = { ...bookedEvents, [eventId]: !isBooked };
      setBookedEvents(updatedBookedEvents);

      await axios.post(
        `http://localhost:3000/bookings/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(
        isBooked
          ? "Booking canceled successfully!"
          : "Event booked successfully!"
      );
    } catch (err) {
      toast.error("Failed to book the event. Please try again.");
      console.error(err);
    }
  };

  // Filter events based on user input
  useEffect(() => {
    let filtered = events;

    if (filterLiked === "liked") {
      filtered = filtered.filter((event) => likedEvents[event._id]);
    } else if (filterLiked === "booked") {
      filtered = filtered.filter((event) => bookedEvents[event._id]);
    }

    if (filterPrice) {
      filtered = filtered.filter((event) => {
        const prices =
          event.price
            ?.match(/\$\d+/g)
            ?.map((price) => parseFloat(price.replace("$", ""))) || [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : Infinity;

        return (
          minPrice <= filterPrice || event.price.includes("Free admission.")
        );
      });
    }

    setFilteredEvents(filtered);
  }, [filterLiked, filterPrice, events, likedEvents, bookedEvents]);

  // Fetch data on component mount
useEffect(() => {
  const initializeData = async () => {
    setEvents([]); // Reset state to avoid stale data
    await fetchData();
    await fetchLikedEvents();
    await fetchBookedEvents();
  };

  initializeData();
}, [location.pathname]); // Re-run whenever the route changes

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
        <div className="mt-10">
          <div className="flex flex-row gap-5 mb-5">
            {/* Dropdown Filter */}
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                backgroundColor: theme === "dark" ? "#424242" : "#F5F5F5",
                borderRadius: "8px",
                "& .MuiInputLabel-root": {
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                },
                "& .MuiOutlinedInput-root": {
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  "& fieldset": {
                    borderColor: theme === "dark" ? "#AAAAAA" : "#000000",
                  },
                  "&:hover fieldset": {
                    borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                  },
                },
              }}
            >
              <InputLabel>Filter by Events</InputLabel>
              <Select
                value={filterLiked}
                onChange={(e) => setFilterLiked(e.target.value)}
                label="Filter by Events"
              >
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="liked">Liked Events</MenuItem>
                <MenuItem value="booked">Booked Events</MenuItem>
              </Select>
            </FormControl>

            {/* Search Box (Price Filter) */}
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                backgroundColor: theme === "dark" ? "#424242" : "#F5F5F5",
                borderRadius: "8px",
                "& .MuiInputLabel-root": {
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                },
                "& .MuiOutlinedInput-root": {
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  "& fieldset": {
                    borderColor: theme === "dark" ? "#AAAAAA" : "#000000",
                  },
                  "&:hover fieldset": {
                    borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                  },
                },
              }}
            >
              <TextField
                label="Filter by Price (under)"
                type="number"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </FormControl>
          </div>

          {/* Table of Events */}
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Venue
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Date/Time
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Presenter
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Like
                  </TableCell>
                  <TableCell
                    sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                  >
                    Book
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow
                      key={event._id}
                      sx={{
            
                        "&:hover": {
                          backgroundColor: theme === "dark" ? "#444444" : "#F0F0F0", // Hover effect color
                        },
                      }}
                    >
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.eventId}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.title}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.venue}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.description}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.dateTime}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.presenter.split("Presented by")[1]}
                      </TableCell>
                      <TableCell
                        sx={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
                      >
                        {event.price}
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column", // Stack the icon and number vertically
                            alignItems: "center", // Center horizontally
                            justifyContent: "center", // Center vertically if needed
                          }}
                        >
                          <IconButton onClick={() => handleLike(event._id)}>
                            {likedEvents[event._id] ? (
                              <ThumbUpAltIcon
                                sx={{
                                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                                  fontSize: "24px", // Adjust icon size if needed
                                }}
                              />
                            ) : (
                              <ThumbUpOffAltIcon
                                sx={{
                                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                                  fontSize: "24px", // Adjust icon size if needed
                                }}
                              />
                            )}
                          </IconButton>
                          <span
                            style={{
                              fontSize: "14px", // Adjust number font size if needed
                              color: theme === "dark" ? "#FFFFFF" : "#000000",
                              marginTop: "-8px", // Reduce spacing between thumb and number if needed
                            }}
                          >
                            {event.likeCount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="warning"
                          sx={{
                            textTransform: "none",
                            color: theme === "dark" ? "#FFFFFF" : "white",
                          }}
                          onClick={() => handleBook(event._id)}
                        >
                          {bookedEvents[event._id] ? "Cancel" : "Book"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={events.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            />
          </TableContainer>
        </div>
      </Container>
    </div>
  );
};

export default EventPage;