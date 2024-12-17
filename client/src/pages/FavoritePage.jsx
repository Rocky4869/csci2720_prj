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
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext"; // Import theme context

const FavoritePage = () => {
  const [favorite, setFavorite] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { theme } = useTheme(); // Access the current theme

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

  const handleFav = async (locationId) => {
    try {
      const isFav = favorite[locationId];
      const updatedFavLocation = { ...favorite, [locationId]: !isFav };
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
            mb: 3,
            backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Favorite Locations
          </Typography>
        </Paper>

        {/* Table Section */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Venue
                </TableCell>
                <TableCell
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Number of Events
                </TableCell>
                <TableCell
                  sx={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  Favorite
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favorite
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location) => (
                  <TableRow
                    key={location.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme === "dark" ? "#444444" : "#f0f0f0", // Hover effect
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
                    <TableCell
                      sx={{
                        color: theme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      <Link
                        to={`/locations/${location.id}`}
                        style={{
                          textDecoration: "none",
                          color: theme === "dark" ? "#1E90FF" : "#0000EE", // Link color
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
                      {location.numberOfEvents || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          backgroundColor:
                            theme === "dark" ? "#555555" : "#FFFFFF",
                          color: theme === "dark" ? "#FFFFFF" : "#000000",
                          "&:hover": {
                            backgroundColor:
                              theme === "dark" ? "#666666" : "#F0F0F0",
                          },
                        }}
                        onClick={() => handleFav(location._id)}
                      >
                        {favorite[location._id]
                          ? "Remove Favorite"
                          : "Add to Favorite"}
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
            sx={{
              backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
              color: theme === "dark" ? "#FFFFFF" : "#000000",
            }}
          />
        </TableContainer>
      </Container>
    </div>
  );
};

export default FavoritePage;