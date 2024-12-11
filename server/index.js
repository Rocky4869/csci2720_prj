const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const nodemon = require("nodemon");
const Location = require("./models/location");
const Event = require("./models/event");
const { DOMParser } = require("xmldom");
const eventRoutes = require("./routes/events");
const locationRoutes = require("./routes/locations");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/locations", locationRoutes);

const fetchData = async () => {
  try {
    // Drop the database - events and locations
    // await mongoose.connection.db.dropDatabase();
    await Location.deleteMany({});
    await Event.deleteMany({});

    // Fetch events data
    const eventsResponse = await axios.get(
      "https://www.lcsd.gov.hk/datagovhk/event/events.xml"
    );
    const eventsParser = new DOMParser();
    const eventsXmlDoc = eventsParser.parseFromString(
      eventsResponse.data,
      "application/xml"
    );
    const events = eventsXmlDoc.getElementsByTagName("event");

    // Fetch locations data
    const locationsResponse = await axios.get(
      "https://www.lcsd.gov.hk/datagovhk/event/venues.xml"
    );
    const locationsParser = new DOMParser();
    const locationsXmlDoc = locationsParser.parseFromString(
      locationsResponse.data,
      "application/xml"
    );
    const locations = locationsXmlDoc.getElementsByTagName("venue");

    const locationMap = {};
    // Map location details to the location
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const locationDetails = {};
      const childNodes = location.childNodes;
      for (let j = 0; j < childNodes.length; j++) {
        const child = childNodes[j];
        if (child.nodeType === 1) {
          locationDetails[child.nodeName] = child.textContent;
          locationDetails.id = location.getAttribute("id");
        }
      }

      locationMap[locationDetails.id] = locationDetails;
    }

    const eventList = [];
    const venueEventCount = {};

    // Map event details to the event
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventDetails = {};
      const childNodes = event.childNodes;

      for (let j = 0; j < childNodes.length; j++) {
        const child = childNodes[j];
        if (child.nodeType === 1) {
          eventDetails[child.nodeName] = child.textContent;
        }
      }

      // Count events per venue
      if (eventDetails.venueid) {
        if (!venueEventCount[eventDetails.venueid]) {
          venueEventCount[eventDetails.venueid] = 0;
        }
        venueEventCount[eventDetails.venueid]++;
      }

      eventList.push({
        title: eventDetails.titlee,
        venueId: eventDetails.venueid,
        dateTime: eventDetails.predateE,
        description: eventDetails.desce,
        presenter: eventDetails.presenterorge,
      });
    }

    // Filter venues with at least 3 events and have lat and long
    const filteredVenues = Object.keys(venueEventCount)
      .filter(
        (venueId) =>
          venueEventCount[venueId] >= 3 &&
          locationMap[venueId].latitude &&
          locationMap[venueId].longitude
      )
      .slice(0, 10);

    const filteredEventList = eventList.filter((event) =>
      filteredVenues.includes(event.venueId)
    );

    // Map location details to the filtered events
    const finalEventList = filteredEventList.map((event) => {
      return {
        title: event.title,
        venue: locationMap[event.venueId].venuee,
        dateTime: event.dateTime,
        description: event.description ? event.description : "N/A",
        presenter: event.presenter,
      };
    });

    // Insert locations to the database
    const locationIdMap = {};
    for (let i = 0; i < filteredVenues.length; i++) {
      const venueId = filteredVenues[i];
      const location = locationMap[venueId];
      const locationData = {
        id: location.id,
        name: location.venuee,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const locationModel = new Location(locationData);
      const savedLocation = await locationModel.save();
      locationIdMap[venueId] = savedLocation._id;
    }

    // Insert events to the database
    for (let i = 0; i < finalEventList.length; i++) {
      const event = finalEventList[i];
      const eventData = {
        eventId: i + 1,
        title: event.title,
        dateTime: event.dateTime,
        description: event.description,
        presenter: event.presenter,
        venue: locationIdMap[filteredEventList[i].venueId],
      };

      const eventModel = new Event(eventData);
      await eventModel.save();
    }
  } catch (error) {
    console.log(error);
  }
};

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://csci2720:csci2720@cluster0.fbcue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await fetchData();
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await connectDB();
})();
