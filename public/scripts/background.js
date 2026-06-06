console.log("background.js loaded");
const images = [
  "/assets/bg-img/1.png",
  "/assets/bg-img/2.png",
  "/assets/bg-img/3.png",
  "/assets/bg-img/4.png",
  "/assets/bg-img/5.png",
  "/assets/bg-img/6.png",
  "/assets/bg-img/7.png",
  "/assets/bg-img/8.png",
  "/assets/bg-img/9.png",
  "/assets/bg-img/10.png",
  "/assets/bg-img/11.png",
  "/assets/bg-img/12.png",
];

let lastIndex = localStorage.getItem("lastBg") || -1;

let randomIndex;
do {
  randomIndex = Math.floor(Math.random() * images.length);
} while (randomIndex == lastIndex);

localStorage.setItem("lastBg", randomIndex);

document.documentElement.style.setProperty(
  "--random-bg",
  `url('${images[randomIndex]}')`,
);
