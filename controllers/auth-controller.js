const User = require("../models/user-schema");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  const { username, fullName, email, password, confirmPassword } = req.body;
  try {
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid Email format",
      });
    }

    if (!fullName.trim()) {
      return res.status(400).json({
        message: "Please enter your full name",
      });
    }

    const existingEmail = await User.findOne({
      email: email,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email address in already in use",
      });
    }

    const existingUsername = await User.findOne({
      username: username,
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

    const user = await User.create({
      username: username.trim(),
      fullName: fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "User created Successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server failed to respond" });
  }
}

module.exports = signUp;
