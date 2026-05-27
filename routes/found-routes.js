const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
  getCategoryPage,
  saveCategory,
} = require("../controllers/found-controller");

router.get("/location", getLocationPage);
router.post("/location", saveLocation);

router.get("/category", getCategoryPage);
router.post("/category", saveCategory);

module.exports = router;
