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

router.get("/location", getLocationPage);
router.get("/description", getDescriptionPage);

router.post("/location", saveLocation);
router.post("/description", saveDescription);

router.get("/image", (req, res) => {
  res.render("lost/image");
});

router.post("/image", upload.array("images", 3), createLostItem);

router.get("/category", getCategoryPage);
router.post("/category", saveCategory);

router.get("/items", getAllLostItems);
router.get("/items/:id", getSingleLostItem);

router.get("/location", auth, getLocationPage);

module.exports = router;
