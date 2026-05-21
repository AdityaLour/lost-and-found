const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/auth-controller");
const passport = require("passport");

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

router.get("/verify", (req, res) => {
  const { email } = req.query;
  res.render("auth/verify", {
    title: "Verify your email",
    email,
    successMessage: null,
    errorMessage: null,
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.send("Google Login Successful");
  },
);

router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password", {
    title: "Forgot Password",
    successMessage: null,
    errorMessage: null,
  });
});

router.get("/verify-reset", (req, res) => {
  const { email } = req.query;
  res.render("auth/verify-reset", {
    title: "Verify Reset OTP",
    email,
    successMessage: null,
    errorMessage: null,
  });
});

router.get("/reset-password", (req, res) => {
  const { email } = req.query;
  res.render("auth/reset-password", {
    title: "Reset Password",
    email,
    successMessage: null,
    errorMessage: null,
  });
});

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
