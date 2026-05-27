const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
  getCategoryPage,
  saveCategory,
  getDescriptionPage,
  saveDescription,
} = require("../controllers/found-controller");

router.get("/location", getLocationPage);
router.post("/location", saveLocation);

router.get("/category", getCategoryPage);
router.post("/category", saveCategory);

router.get("/description", getDescriptionPage);
router.post("/description", saveDescription);

module.exports = router;
