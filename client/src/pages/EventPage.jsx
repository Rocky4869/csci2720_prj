import { useEffect, useState } from "react";
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
} from "@mui/material";
import Navbar from "../components/Navbar";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      }));
      setEvents(updatedEvents);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    fetchData();
    fetchLikedEvents();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLike = async (eventId) => {
    try {
      const isLiked = likedEvents[eventId];
      const updatedLikedEvents = { ...likedEvents, [eventId]: !isLiked };
      console.log(updatedLikedEvents);
      setLikedEvents(updatedLikedEvents);

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

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <Navbar />

      <Container>
        <div className="mt-10">
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
                  <TableCell>Like</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.eventId}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{event.dateTime}</TableCell>
                      <TableCell>
                        {event.presenter.split("Presented by")[1]}
                      </TableCell>
                      <TableCell>{event.price}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleLike(event._id)}>
                          {likedEvents[event._id] ? (
                            <ThumbUpAltIcon />
                          ) : (
                            <ThumbUpOffAltIcon />
                          )}
                        </IconButton>
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
        </div>
      </Container>
    </div>
  );
};

export default EventPage;
