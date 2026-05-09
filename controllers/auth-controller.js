const User = require("../models/user-schema");
const PendingUser = require("../models/pendingUser-schema");
const bcrypt = require("bcrypt");
const transporter = require("../config/mail");

async function signUp(req, res) {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid Email format",
      });
    }

    if (!username.trim()) {
      return res.status(400).json({
        message: "Please enter username",
      });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email address in already in use",
      });
    }

    const existingUsername = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exist try a diffrent one",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingPendingUser = await PendingUser.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingPendingUser) {
      return res.status(400).json({
        message: "OTP already sent. Please verify your email.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await PendingUser.create({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      otp: otp,
      expiresAt: expiresAt,
      lastOtpSentAt: Date.now(),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email.trim().toLowerCase(),

      subject: "Otp Verification",

      text: `Your OTP is ${otp}`,
    });
    return res.redirect(
      `/auth/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`,
    );
  } catch (err) {
    return res.status(500).json({ message: "Server failed to respond" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!userExist) {
      return res.status(401).json({
        message: "No User found",
      });
    }

    const comparePassword = await bcrypt.compare(password, userExist.password);
    if (!comparePassword) {
      return res.status(401).json({
        message: "Please enter the correct password",
      });
    }
    req.session.user = {
      id: userExist._id,
      username: userExist.username,
    };

    return res.status(200).json({
      message: "Logged in Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed, please try again",
    });
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const pendingUser = await PendingUser.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending verification found",
      });
    }

    if (pendingUser.expiresAt < Date.now()) {
      await PendingUser.deleteOne({
        email: email.toLowerCase().trim(),
      });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (pendingUser.otp.trim() !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        errorMessage: "Invalid OTP",
      });
    }

    const user = await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    await PendingUser.deleteOne({
      email: pendingUser.email,
    });

    return res.status(201).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server failed to respond",
    });
  }
}

async function resendOtp(req, res) {
  const { email } = req.body;
  try {
    console.log("RESEND STARTED");
    const pendingUser = await PendingUser.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "No pending verification Found",
      });
    }

    const now = Date.now();
    const diff = now - pendingUser.lastOtpSentAt;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (diff < 30000) {
      return res.render("auth/verify", {
        title: "Verify Your email",
        email,
        successMessage: null,
        errorMessage: "Please wait 30 seconds before requesting another OTP",
      });
    }

    console.log("BEFORE EMAIL");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: pendingUser.email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });
    console.log("AFTER EMAIL");

    pendingUser.otp = otp;
    pendingUser.expiresAt = Date.now() + 5 * 60 * 1000;
    pendingUser.lastOtpSentAt = Date.now();
    await pendingUser.save();

    return res.render("auth/verify", {
      title: "Verify your email",
      email,
      successMessage: "OTP sent successfully",
      errorMessage: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Failed to respond",
    });
  }
}
module.exports = {
  signUp: signUp,
  login: login,
  verifyOtp: verifyOtp,
  resendOtp: resendOtp,
};
