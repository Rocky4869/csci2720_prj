import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SingleLocationPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/locations/${id}`
        );
        setLocation(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocation();
  }, [id]);

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{location.name}</h1>
    </div>
  );
}

export default SingleLocationPage;
