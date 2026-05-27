const cloudinary = require("../config/cloudinary");
const LostItem = require("../models/lost-schema");
const streamifier = require("streamifier");

async function getLocationPage(req, res) {
  try {
    return res.render("lost/location", {
      title: "Lost Item Location",
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

    req.session.lostItem = {
      location: {
        address,
        latitude,
        longitude,
        source,
      },
    };

    return res.redirect("/lost/description");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server failed to respond");
  }
}

async function getDescriptionPage(req, res) {
  try {
    return res.render("lost/description", { title: "Lost Item description" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server failed to respond");
  }
}

async function saveDescription(req, res) {
  const { title, category, details, lostDate } = req.body;

  try {
    req.session.lostItem.description = {
      title: title.trim(),

      category,

      details: details.trim(),

      lostDate,
    };

    return res.redirect("/lost/image");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed");
  }
}

async function createLostItem(req, res) {
  try {
    const imageUrls = [];

    for (const file of req.files) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(
        base64,

        {
          folder: "lost-items",
        },
      );

      imageUrls.push(result.secure_url);
    }

    const finalLostItem = await LostItem.create({
      user: req.user._id,

      location: req.session.lostItem.location,

      description: req.session.lostItem.description,

      images: imageUrls,
    });

    return res.send("DB SUCCESS");
  } catch (error) {
    console.log("FULL ERROR:");

    console.log(error);

    return res.status(500).send("DB FAILED");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
  getDescriptionPage,
  saveDescription,
  createLostItem,
};
