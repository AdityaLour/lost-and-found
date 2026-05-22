async function getLocationPage(req, res) {
  try {
    return res.render("lost/location", {
      title: "Lost Item Location",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server failed to respond");
  }
}

async function saveLocation(req, res) {
  const { address, latitude, longitude, source } = req.body;
  try {
    if (!address || !latitude || !longitude) {
      return res.status(400).send("Please select a valid location");
    }

    req.session.lostItem = {
      location: {
        address,
        latitude,
        longitude,
        source,
      },
    };

    console.log(req.session.lostItem);
    return res.redirect("/lost/description");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server failed to respond");
  }
}

module.exports = {
  getLocationPage,
  saveLocation,
};
