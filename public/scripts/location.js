const locationInput = document.getElementById("location-input");
const suggestionsContainer = document.getElementById("suggestions");
const locationMessage = document.getElementById("location-message");
const currentLocationBtn = document.getElementById("current-location-btn");
const map = L.map("map").setView([28.6139, 77.209], 13);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {
    attribution: "&copy; OpenStreetMap contributors",
  },
).addTo(map);

let marker = null;
let selectedLocation = null;

function updateHiddenInputs() {
  document.getElementById("address").value = selectedLocation.address;
  document.getElementById("latitude").value = selectedLocation.latitude;
  document.getElementById("longitude").value = selectedLocation.longitude;
  document.getElementById("source").value = selectedLocation.source;
}

function updateMap(latitude, longitude) {
  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([latitude, longitude]).addTo(map);
  map.setView([latitude, longitude], 15);
}

locationInput.addEventListener("input", async () => {
  const query = locationInput.value.trim();

  selectedLocation = null;
  if (query.length < 3) {
    suggestionsContainer.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`,
    );

    const data = await response.json();
    suggestionsContainer.innerHTML = "";

    data.features.slice(0, 6).forEach((place) => {
      const suggestion = document.createElement("div");
      suggestion.classList.add("suggestion-item");

      const locationName = [
        place.properties.name,
        place.properties.city,
        place.properties.state,
        place.properties.country,
      ]
        .filter(Boolean)
        .join(", ");

      suggestion.textContent = locationName;

      suggestion.addEventListener("click", () => {
        const latitude = place.geometry.coordinates[1];
        const longitude = place.geometry.coordinates[0];

        locationInput.value = locationName;
        suggestionsContainer.innerHTML = "";

        selectedLocation = {
          address: locationName,
          latitude,
          longitude,
          source: "manual",
        };

        updateHiddenInputs();
        updateMap(latitude, longitude);
        locationMessage.textContent = "Location selected successfully";
        console.log(selectedLocation);
      });
      suggestionsContainer.appendChild(suggestion);
    });
  } catch (error) {
    console.log(error);
    locationMessage.textContent = "Failed to fetch locations";
  }
});

currentLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationMessage.textContent = "Geolocation is not supported";
    return;
  }

  locationMessage.textContent = "Fetching current location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );

        const data = await response.json();
        const address = data.display_name;
        locationInput.value = address;

        selectedLocation = {
          address,
          latitude,
          longitude,
          source: "current",
        };

        updateHiddenInputs();
        updateMap(latitude, longitude);
        locationMessage.textContent = "Current location selected";

        console.log(selectedLocation);
      } catch (error) {
        console.log(error);

        locationMessage.textContent = "Failed to fetch address";
      }
    },

    () => {
      locationMessage.textContent = "Location permission denied";
    },
  );
});
