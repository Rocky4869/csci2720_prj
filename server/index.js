const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const xml2js = require("xml2js");
const Location = require("./models/location");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://csci2720:csci2720@cluster0.fbcue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await connectDB();
})();
