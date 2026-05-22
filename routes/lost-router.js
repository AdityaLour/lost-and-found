const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
} = require("../controllers/lost-controller");

router.get("/location", getLocationPage);

router.post("/location", saveLocation);

module.exports = router;
