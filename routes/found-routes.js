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

router.get("/location", auth, getLocationPage);
router.post("/location", auth, saveLocation);

router.get("/category", auth, getCategoryPage);
router.post("/category", auth, saveCategory);

router.get("/description", auth, getDescriptionPage);
router.post("/description", auth, saveDescription);

router.get("/image", auth, (req, res) => {
  res.render("found/image");
});

router.post("/image", auth, upload.array("images", 3), createFoundItem);

router.get("/items", getAllFoundItems);
router.get("/items/:id", getSingleFoundItem);

module.exports = router;
