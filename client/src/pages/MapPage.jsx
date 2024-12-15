import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import React, { useState, useEffect } from "react";

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBoHT48I9gj7Thsaltiw3qgphZL7M8Bzf0",
  });

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

  const defaultPosition = { lat: 22.501639, lng: 114.128911 };

  const groupedLocations = locations.reduce((acc, location) => {
    const key = `${location.latitude},${location.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(location);
    return acc;
  }, {});

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div style={{ height: "calc(100vh - 77px)", width: "100%" }}>
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
              <div>
                {groupedLocations[openInfoWindow].map((location) => (
                  <p key={location._id} style={{ margin: "5px 0" }}>
                    <Link to={`/locations/${location.id}`}>
                      {location.name}
                    </Link>
                  </p>
                ))}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default MapPage;
