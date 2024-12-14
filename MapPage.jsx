import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "AIzaSyBoHT48I9gj7Thsaltiw3qgphZL7M8Bzf0";
const NEXT_PUBLIC_MAP_ID = "67dfa868a1478c1c";

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/locations");
        setLocations(response.data);
      } catch (err) {
        setError("Error fetching locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const defaultPosition = { lat: 22.501639, lng: 114.128911 };

  // Group locations by latitude and longitude
  const groupedLocations = locations.reduce((acc, location) => {
    const key = `${location.latitude},${location.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(location);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <APIProvider apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: "calc(100vh - 77px)", width: "100%" }}>
          <Map 
            zoom={11} 
            center={defaultPosition} 
            mapId={NEXT_PUBLIC_MAP_ID}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              draggable: true,
              scrollwheel: true,
              panControl: true
            }}
            style={{ height: "100%", width: "100%" }}
          >
            {Object.keys(groupedLocations).map(key => {
              const [lat, lng] = key.split(",").map(Number);
              return (
                <AdvancedMarker
                  key={key}
                  position={{ lat, lng }}
                  onClick={() => setOpenInfoWindow(key)}
                />
              );
            })}

            {openInfoWindow && (
              <InfoWindow
                position={{ lat: groupedLocations[openInfoWindow][0].latitude, lng: groupedLocations[openInfoWindow][0].longitude }}
                onCloseClick={() => setOpenInfoWindow(null)}
              >
                <div>
                  {groupedLocations[openInfoWindow].map(location => (
                    <p key={location._id} style={{ margin: "5px 0" }}>
                      <Link to={`/locations/${location.id}`}>
                        {location.name}
                      </Link>
                    </p>
                  ))}
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default MapPage;