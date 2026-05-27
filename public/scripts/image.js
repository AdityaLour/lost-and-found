const imageInput = document.getElementById("images");

const previewContainer = document.getElementById("preview-container");

imageInput.addEventListener(
  "change",

  () => {
    previewContainer.innerHTML = "";

    const files = imageInput.files;

    if (files.length > 3) {
      alert("Maximum 3 images allowed");

      imageInput.value = "";

      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = document.createElement("img");

        image.src = event.target.result;

        image.classList.add("preview-image");

        previewContainer.appendChild(image);
      };

      reader.readAsDataURL(file);
    });
  },
);
