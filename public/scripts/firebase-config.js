import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgGRFCPyThwylZPvwipd1wvzwpJbrhHi8",
  authDomain: "lost-found-da4f5.firebaseapp.com",
  projectId: "lost-found-da4f5",
  storageBucket: "lost-found-da4f5.firebasestorage.app",
  messagingSenderId: "563889190314",
  appId: "1:563889190314:web:d0cd386878ebf91ff0e7d3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
