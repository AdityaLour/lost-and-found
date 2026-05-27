const cloudinary = require("../config/cloudinary");
const FoundItem = require("../models/found-schema");

async function getLocationPage(req, res) {
  try {
    return res.render("found/location", {
      title: "Found Item Location",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

async function saveLocation(req, res) {
  const { address, latitude, longitude, source } = req.body;

  try {
    if (!address || !latitude || !longitude) {
      return res.status(400).send("Please select a valid location");
    }

    req.session.foundItem = {
      location: {
        address,
        latitude,
        longitude,
        source,
      },
    };

    return res.redirect("/found/category");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
};
