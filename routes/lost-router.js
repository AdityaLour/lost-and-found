const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
  getDescriptionPage,
  saveDescription,
  getCategoryPage,
  saveCategory,
  createLostItem,
  getAllLostItems,
  getSingleLostItem,
} = require("../controllers/lost-controller");

const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

router.get("/location", auth, getLocationPage);
router.get("/description", auth, getDescriptionPage);

router.post("/location", auth, saveLocation);
router.post("/description", auth, saveDescription);

router.get("/image", auth, (req, res) => {
  res.render("lost/image");
});

router.post("/image", auth, upload.array("images", 3), createLostItem);

router.get("/category", auth, getCategoryPage);
router.post("/category", auth, saveCategory);

router.get("/items", getAllLostItems);
router.get("/items/:id", getSingleLostItem);

module.exports = router;
