const User = require("../models/user-schema");
const admin = require("../config/firebase-admin");

async function startSignUp(req, res) {
  const { username, phoneNumber } = req.body;
  try {
    if (!username || !username.trim()) {
      return res.status(400).json({
        message: "Please enter username",
      });
    }

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber.trim())) {
      return res.status(400).json({
        message: "Enter a valid phone number",
      });
    }

    const existingUser = await User.findOne({
      phoneNumber: phoneNumber.trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    req.session.pendingSignUp = {
      username: username.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    return res.status(200).json({
      message: "SignUp initiated",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server failed to respond",
    });
  }
}

async function completeSignup(req, res) {
  const { idToken } = req.body;
  console.log("COMPLETE SIGNUP HIT");
  console.log(req.body);
  console.log(req.session.pendingSignUp);
  try {
    if (!idToken) {
      return res.status(400).json({
        message: "ID token required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!req.session.pendingSignUp) {
      return res.status(400).json({
        message: "No signup request found",
      });
    }

    const { username, phoneNumber } = req.session.pendingSignUp;

    const firebasePhone = decodedToken.phone_number;

    if (firebasePhone !== `+91${phoneNumber}`) {
      return res.status(400).json({
        message: "Phone verification failed",
      });
    }

    const existingUser = await User.findOne({
      phoneNumber,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    const user = await User.create({
      username,
      phoneNumber,
    });

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    delete req.session.pendingSignUp;

    return res.status(200).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server failed to respond",
    });
  }
}

async function startLogin(req, res) {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    req.session.pendingLogin = {
      phoneNumber,
    };

    return res.status(200).json({
      message: "OTP can be sent",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server failed to respond",
    });
  }
}

async function completeLogin(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "ID token required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!req.session.pendingLogin) {
      return res.status(400).json({
        message: "Login session expired",
      });
    }

    const { phoneNumber } = req.session.pendingLogin;

    if (decodedToken.phone_number !== `+91${phoneNumber}`) {
      return res.status(400).json({
        message: "Phone verification failed",
      });
    }

    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    delete req.session.pendingLogin;

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server failed to respond",
    });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
}

module.exports = {
  startSignUp,
  completeSignup,
  startLogin,
  completeLogin,
  logout,
};
