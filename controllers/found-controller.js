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

async function getCategoryPage(req, res) {
  try {
    return res.render("found/category");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed");
  }
}

async function saveCategory(req, res) {
  const { category } = req.body;

  try {
    if (!category) {
      return res.status(400).send("Please select category");
    }

    req.session.foundItem.category = category;

    return res.redirect("/found/description");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
  getCategoryPage,
  saveCategory,
};
