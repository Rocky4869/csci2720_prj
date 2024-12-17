import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import Navbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    description: "",
    presenter: "",
    venue: "",
    price: "",
  });

  const { theme } = useTheme();

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
        venueName: locations.find((location) => location._id === event.venue)
          ?.name,
      }));

      setLocations(locations);
      setEvents(updatedEvents);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  const handleOpen = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        dateTime: event.dateTime,
        description: event.description,
        presenter: event.presenter,
        venue: event.venue,
        price: event.price,
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: "",
        dateTime: "",
        description: "",
        presenter: "",
        venue: "",
        price: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedEvent) {
        await axios.put(
          `http://localhost:3000/events/${selectedEvent.eventId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Event updated successfully!");
      } else {
        await axios.post("http://localhost:3000/events", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Event created successfully!");
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:3000/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Event deleted successfully!");
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {/* Title Section */}
        <Paper
          sx={{
            p: 3,
            mb: 2,
            backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Event Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme === "dark" ? "#B0B0B0" : "#6C6C6C",
            }}
          >
            Manage events in the system. You can create, update, and delete
            events, as well as view their associated details.
          </Typography>
        </Paper>

        {/* Create Event Button */}
        <Button
          variant="outlined"
          onClick={() => handleOpen()}
          sx={{
            marginBottom: "20px",
            textTransform: "none",
            fontWeight: 500,
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
            "&:hover": {
              backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
            },
          }}
        >
          Create New Event
        </Button>

        {/* Event Table */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Table>
            {/* Table Head */}
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
                }}
              >
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
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Venue
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Date/Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Presenter
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {events
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                  <TableRow
                    key={event._id}
                    sx={{
                      backgroundColor: theme === "dark" ? "#222222" : "#FFFFFF",
                      "&:hover": {
                        backgroundColor: theme === "dark" ? "#333333" : "#F9F9F9",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.eventId}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.venueName}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.description}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.dateTime}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.presenter}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {event.price}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpen(event)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          color: theme === "dark" ? "#FFFFFF" : "#000000",
                          borderColor: theme === "dark" ? "#FFFFFF" : "#000000",
                          "&:hover": {
                            backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
                          },
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleDelete(event.eventId)}
                        sx={{
                          marginTop: "10px", // Adds vertical spacing between the two buttons
                          textTransform: "none",
                          fontWeight: 500,
                          color: theme === "dark" ? "#FF6B6B" : "#D32F2F",
                          borderColor: theme === "dark" ? "#FF6B6B" : "#D32F2F",
                          "&:hover": {
                            backgroundColor: theme === "dark" ? "#333333" : "#FFEBEE",
                          },
                        }}
                      >
                        Delete
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
              backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0",
              color: theme === "dark" ? "#FFFFFF" : "#000000",
            }}
          />
        </TableContainer>

        {/* Event Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {selectedEvent ? "Update Event" : "Create New Event"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date/Time"
              value={formData.dateTime}
              onChange={(e) =>
                setFormData({ ...formData, dateTime: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Presenter"
              value={formData.presenter}
              onChange={(e) =>
                setFormData({ ...formData, presenter: e.target.value })
              }
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Venue</InputLabel>
              <Select
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                label="Venue"
              >
                {locations.map((location) => (
                  <MenuItem key={location._id} value={location._id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {selectedEvent ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default AdminPage;