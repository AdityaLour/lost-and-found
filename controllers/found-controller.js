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
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
        address,
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

async function getDescriptionPage(req, res) {
  try {
    return res.render("found/description", {
      title: "Found Item Description",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

async function saveDescription(req, res) {
  const { details, lostDate } = req.body;

  try {
    if (new Date(lostDate) > new Date()) {
      return res.status(400).send("Invalid found date");
    }

    req.session.foundItem.description = {
      category: req.session.foundItem.category,
      details: details.trim(),
      lostDate,
    };

    return res.redirect("/found/image");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed");
  }
}

async function createFoundItem(req, res) {
  try {
    const imageUrls = [];

    for (const file of req.files) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(
        base64,

        {
          folder: "found-items",
        },
      );

      imageUrls.push(result.secure_url);
    }

    await FoundItem.create({
      user: req.user._id,

      location: req.session.foundItem.location,

      description: req.session.foundItem.description,

      images: imageUrls,
    });

    req.session.foundItem = null;

    return res.send("Found item Saved");
  } catch (error) {
    console.log(error);

    return res.status(500).send("DB FAILED");
  }
}

async function getAllFoundItems(req, res) {
  try {
    const foundItems = await FoundItem.find().sort({
      createdAt: -1,
    });

    return res.render("found/index", {
      foundItems,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

async function getSingleFoundItem(req, res) {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).send("Found item not found");
    }

    return res.render("found/show", {
      foundItem,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
  getCategoryPage,
  saveCategory,
  getDescriptionPage,
  saveDescription,
  createFoundItem,
  getAllFoundItems,
  getSingleFoundItem,
};
