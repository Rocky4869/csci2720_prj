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
} from "@mui/material";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FavoritePage = () => {
  const [favorite, setFavorite] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchFavLocation = async () => {
    try {
      const response = await axios.get("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const favLocation = response.data;
      setFavorite(favLocation);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(favorite);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                  <TableCell>Venue</TableCell>
                  <TableCell>Number of events</TableCell>
                  <TableCell>Favorite</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favorite
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.id}</TableCell>
                      <TableCell>
                        <Link to={`/locations/${location.id}`}>
                          {location.name}
                        </Link>
                      </TableCell>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>
                        {/* {location.presenter.split("Presented by")[1]} */}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          // color="warning"
                          sx={{
                            textTransform: "none",
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
