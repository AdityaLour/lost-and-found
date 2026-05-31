const compareImages = require("../services/compare-images");

async function testImageComparison(req, res) {
  const result = await compareImages("LOST_IMAGE_URL", "FOUND_IMAGE_URL");

  console.log(result);

  return res.json(result);
}

module.exports = {
  testImageComparison,
};
