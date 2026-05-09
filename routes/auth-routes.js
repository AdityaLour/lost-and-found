const express = require("express");
const router = express.Router();
const { signUp, login, verifyOtp } = require("../controllers/auth-controller");

router.get("/getstarted", (req, res) => {
  const activeForm = req.query.form || "signup";
  res.render("auth/get-started", {
    activeForm,
    title: activeForm === "signup" ? "Create a new Account" : "Welcome Back!",
  });
});

router.get("/signup", (req, res) => {
  res.render("auth/signup", {
    activeForm: "signup",
    title: "Create a new account",
  });
});

router.get("/login", (req, res) => {
  res.render("auth/login", {
    activeForm: "login",
    title: "Welcome back!",
  });
});

router.get("/verify", (req, res) => {
  const { email } = req.query;
  res.render("auth/verify", {
    title: "Verify your email",
    email,
  });
});

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify", verifyOtp);

module.exports = router;
