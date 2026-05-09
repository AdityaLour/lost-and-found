const User = require("../models/user-schema");
const bcrypt = require("bcrypt");

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

    const user = await User.create({
      username: username.trim().toLowerCase(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    return res.status(201).json({
      message: "User created Successfully",
    });
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

module.exports = {
  signUp: signUp,
  login: login,
};
