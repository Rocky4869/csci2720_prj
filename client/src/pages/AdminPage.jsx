import React, { useState, useEffect } from "react";
import {
  Container,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import Navbar from "../components/AdminNavbar";
import { toast } from "react-toastify";

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
        venueName: locations.find((location) => location._id === event.venue)?.name,
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
          `http://localhost:3000/events/${selectedEvent._id}`,
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
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <Navbar />
      <Container>
        <div className="mt-10">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            sx={{ marginBottom: 2 }}
          >
            Create New Event
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Presenter</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.eventId}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.venueName}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{event.dateTime}</TableCell>
                      <TableCell>{event.presenter}</TableCell>
                      <TableCell>{event.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(event)}
                          sx={{ marginRight: 1 }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(event._id)}
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
            />
          </TableContainer>

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
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {selectedEvent ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;