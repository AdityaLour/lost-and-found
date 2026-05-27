const express = require("express");
const router = express.Router();

const {
  getLocationPage,
  saveLocation,
  getDescriptionPage,
  saveDescription,
  createLostItem,
} = require("../controllers/lost-controller");

const upload = require("../middlewares/upload");

router.get("/location", getLocationPage);
router.get("/description", getDescriptionPage);

router.post("/location", saveLocation);
router.post("/description", saveDescription);

router.get("/image", (req, res) => {
  res.render("lost/image");
});

router.post("/image", upload.array("images", 3), createLostItem);

module.exports = router;
