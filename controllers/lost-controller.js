const cloudinary = require("../config/cloudinary");
const LostItem = require("../models/lost-schema");
const FoundItem = require("../models/found-schema");

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

    return res.redirect("/lost/category");
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

async function getCategoryPage(req, res) {
  try {
    return res.render("lost/category");
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

    req.session.lostItem.category = category;

    console.log(req.session.lostItem);

    return res.redirect("/lost/description");
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed");
  }
}

async function saveDescription(req, res) {
  const { details, lostDate } = req.body;

  try {
    if (new Date(lostDate) > new Date()) {
      return res.status(400).send("Invalid lost date");
    }
    req.session.lostItem.description = {
      category: req.session.lostItem.category,

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

async function getAllLostItems(req, res) {
  try {
    const lostItems = await LostItem.find().sort({
      createdAt: -1,
    });

    return res.render("lost/lost-item", {
      lostItems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server failed to respond");
  }
}

async function getSingleLostItem(req, res) {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) {
      return res.status(404).send("Lost item not found");
    }

    const isOwner = req.user && lostItem.user.equals(req.user._id);

    function calculateMatchScore(lostItem, foundItem) {
      let score = 0;

      const lostDetails = lostItem.description.details.toLowerCase();
      const foundDetails = foundItem.description.details.toLowerCase();

      const lostWords = lostDetails.split(" ");
      const foundWords = foundDetails.split(" ");

      for (const word of lostWords) {
        if (foundWords.includes(word) && word.length > 3) {
          score += 3;
        }
      }

      if (lostItem.description.category === foundItem.description.category) {
        score += 5;
      }

      const lostDate = new Date(lostItem.description.lostDate);
      const foundDate = new Date(foundItem.description.lostDate);

      const dateDifference = Math.abs(foundDate - lostDate);
      const daysDifference = dateDifference / (1000 * 60 * 60 * 24);

      if (daysDifference <= 3) {
        score += 3;
      }

      return score;
    }

    let possibleFinds = [];

    if (isOwner) {
      const foundItems = await FoundItem.find();
      const scoredFinds = foundItems.map((item) => {
        return {
          item,
          score: calculateMatchScore(lostItem, item),
        };
      });

      possibleFinds = scoredFinds
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((entry) => entry.item);
    }

    return res.render(
      "lost/show",

      {
        lostItem,
        isOwner,
        possibleFinds,
      },
    );
  } catch (error) {
    console.log(error);

    return res.status(500).send("Server failed to respond");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
  getDescriptionPage,
  saveDescription,
  createLostItem,
  getCategoryPage,
  saveCategory,
  getAllLostItems,
  getSingleLostItem,
};
