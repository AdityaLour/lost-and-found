const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/auth-controller");

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

router.post("/signup", signUp);

module.exports = router;
