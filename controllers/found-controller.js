const cloudinary = require("../config/cloudinary");
const FoundItem = require("../models/found-schema");

async function getLocationPage(req, res) {
  try {
    return res.render("found/location", {
      title: "Found Item Location",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
  }
}

async function saveLocation(req, res) {
  const { address, latitude, longitude, source } = req.body;

  try {
    if (!address || !latitude || !longitude) {
      return res.status(400).render("errors/400");
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

    return res.status(500).render("errors/500");
  }
}

async function getCategoryPage(req, res) {
  try {
    return res.render("found/category");
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
  }
}

async function saveCategory(req, res) {
  const { category } = req.body;

  try {
    if (!category) {
      return res.status(400).render("errors/400");
    }

    req.session.foundItem.category = category;

    return res.redirect("/found/description");
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
  }
}

async function getDescriptionPage(req, res) {
  try {
    return res.render("found/description", {
      title: "Found Item Description",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
  }
}

async function saveDescription(req, res) {
  const { details, lostDate } = req.body;

  try {
    if (new Date(lostDate) > new Date()) {
      return res.status(400).render("errors/400");
    }

    req.session.foundItem.description = {
      category: req.session.foundItem.category,
      details: details.trim(),
      lostDate,
    };

    return res.redirect("/found/image");
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
  }
}

async function createFoundItem(req, res) {
  if (!req.session.foundItem) {
    return res.redirect("/found/location");
  }
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

    const foundItem = await FoundItem.create({
      user: req.user.id,

      location: req.session.foundItem.location,

      description: req.session.foundItem.description,

      images: imageUrls,
    });

    req.session.foundItem = null;

    return res.redirect(`/found/items/${foundItem._id}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("errors/500");
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

    return res.status(500).render("errors/500");
  }
}

async function getSingleFoundItem(req, res) {
  try {
    const foundItem = await FoundItem.findById(req.params.id).populate("user");

    if (!foundItem) {
      return res.status(404).render("errors/404");
    }

    return res.render("found/show", {
      foundItem,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).render("errors/500");
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
