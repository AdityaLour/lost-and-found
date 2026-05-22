const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
  getDescriptionPage,
  saveDescription,
} = require("../controllers/lost-controller");

router.get("/location", getLocationPage);
router.get("/description", getDescriptionPage);

router.post("/location", saveLocation);
router.post("/description", saveDescription);

module.exports = router;
