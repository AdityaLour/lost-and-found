const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  getLocationPage,
  saveLocation,
  getCategoryPage,
  saveCategory,
  getDescriptionPage,
  saveDescription,
  createFoundItem,
  getAllFoundItems,
  getSingleFoundItem,
} = require("../controllers/found-controller");

const auth = require("../middlewares/auth");

router.get("/location", getLocationPage);
router.post("/location", saveLocation);

router.get("/category", getCategoryPage);
router.post("/category", saveCategory);

router.get("/description", getDescriptionPage);
router.post("/description", saveDescription);

router.get("/image", (req, res) => {
  res.render("found/image");
});

router.post("/image", upload.array("images", 3), createFoundItem);

router.get("/items", getAllFoundItems);
router.get("/items/:id", getSingleFoundItem);

router.get("/location", auth, getLocationPage);

module.exports = router;
