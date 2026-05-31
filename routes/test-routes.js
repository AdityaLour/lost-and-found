const express = require("express");
const router = express.Router();

const { testImageComparison } = require("../controllers/test-controller");

router.get("/image", testImageComparison);

module.exports = router;
