const express = require("express");
const router = express.Router();

const {
  startSignUp,
  completeSignup,
  startLogin,
  completeLogin,
} = require("../controllers/auth-controller");

router.get("/getstarted", (req, res) => {
  const activeForm = req.query.form || "signup";

  res.render("auth/get-started", {
    activeForm,
    title: activeForm === "signup" ? "Create a new Account" : "Welcome Back!",
    successMessage: null,
    errorMessage: null,
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

router.post("/start-signUp", startSignUp);
router.post("/complete-signup", completeSignup);

router.post("/start-login", startLogin);
router.post("/complete-login", completeLogin);

module.exports = router;
