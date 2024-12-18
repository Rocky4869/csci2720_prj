import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Typography, Paper, Container, Grid } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);

  const { theme } = useTheme(); // Access theme context
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBoHT48I9gj7Thsaltiw3qgphZL7M8Bzf0",
  });

  const defaultPosition = { lat: 22.501639, lng: 114.128911 };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/locations");
        setLocations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocations();
  }, []);

  const groupedLocations = locations.reduce((acc, location) => {
    const key = `${location.latitude},${location.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(location);
    return acc;
  }, {});

  if (!isLoaded) {
    return <div></div>;
  }

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
            Venue Locations
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme === "dark" ? "#B0B0B0" : "#6C6C6C",
            }}
          >
            Explore the locations of different venues on the map below. Click on
            the markers to view more details about each venue.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Map Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                minHeight: "450px",
                backgroundColor: theme === "dark" ? "#333333" : "#FFFFFF",
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Map
              </Typography>
              <div
                style={{ height: "400px", width: "100%", borderRadius: "8px" }}
              >
                <GoogleMap
                  zoom={11}
                  center={defaultPosition}
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                >
                  {Object.keys(groupedLocations).map((key) => {
                    const [lat, lng] = key.split(",").map(Number);
                    return (
                      <Marker
                        key={key}
                        position={{ lat, lng }}
                        onClick={() => setOpenInfoWindow(key)}
                      />
                    );
                  })}

                  {openInfoWindow && (
                    <InfoWindow
                      position={{
                        lat: groupedLocations[openInfoWindow][0].latitude,
                        lng: groupedLocations[openInfoWindow][0].longitude,
                      }}
                      onCloseClick={() => setOpenInfoWindow(null)}
                    >
                      {/* Styled InfoWindow Content */}
                      <div
                        style={{
                          color: "#000000", // Always black text for visibility
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        {groupedLocations[openInfoWindow].map((location) => (
                          <p key={location._id} style={{ margin: "5px 0" }}>
                            <Link
                              to={`/locations/${location.id}`}
                              style={{
                                textDecoration: "none",
                                color: "#1E90FF", // Link color
                              }}
                            >
                              {location.name}
                            </Link>
                          </p>
                        ))}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MapPage;
