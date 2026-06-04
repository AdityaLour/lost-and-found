import { auth } from "./firebase-config.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const activeForm = signupForm || loginForm;

if (!activeForm) {
  throw new Error("No auth form found");
}

const isSignupPage = !!signupForm;

const otpSection = document.getElementById("otpSection");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const submitBtn = activeForm.querySelector('button[type="submit"]');
const messageBox = document.getElementById("messageBox");

window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "normal",
});

await window.recaptchaVerifier.render();

let confirmationResult = null;
let verifiedIdToken = null;

function showMessage(message, isError = false) {
  messageBox.textContent = message;
  messageBox.style.color = isError ? "#dc2626" : "#16a34a";
}

function clearMessage() {
  messageBox.textContent = "";
}

activeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearMessage();

  try {
    const usernameInput = document.getElementById("username");

    const phoneNumber = document.getElementById("phoneNumber").value.trim();

    // CREATE ACCOUNT / LOGIN
    if (
      submitBtn.textContent === "Create Account" ||
      submitBtn.textContent === "Login"
    ) {
      if (!verifiedIdToken) {
        showMessage("Please verify OTP first", true);
        return;
      }

      submitBtn.disabled = true;

      submitBtn.textContent = isSignupPage
        ? "Creating Account..."
        : "Logging In...";

      const response = await fetch(
        isSignupPage ? "/auth/complete-signup" : "/auth/complete-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: verifiedIdToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        submitBtn.disabled = false;

        submitBtn.textContent = isSignupPage ? "Create Account" : "Login";

        showMessage(data.message, true);
        return;
      }

      showMessage(
        isSignupPage ? "Account created successfully" : "Login successful",
      );

      setTimeout(() => {
        window.location.href = "/lost/items";
      }, 1200);

      return;
    }

    let body;

    if (isSignupPage) {
      body = {
        username: usernameInput.value.trim(),
        phoneNumber,
      };
    } else {
      body = {
        phoneNumber,
      };
    }

    const response = await fetch(
      isSignupPage ? "/auth/start-signup" : "/auth/start-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message, true);
      return;
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      `+91${phoneNumber}`,
      window.recaptchaVerifier,
    );

    otpSection.style.display = "block";

    document.getElementById("phoneNumber").readOnly = true;

    if (usernameInput) {
      usernameInput.readOnly = true;
    }

    document.getElementById("recaptcha-container").style.display = "none";

    submitBtn.style.display = "none";

    showMessage("OTP sent successfully");
  } catch (error) {
    console.error(error);

    showMessage("Failed to send OTP. Please try again.", true);
  }
});

verifyOtpBtn.addEventListener("click", async () => {
  clearMessage();

  try {
    if (!confirmationResult) {
      showMessage("Please request OTP first", true);
      return;
    }

    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
      showMessage("Please enter OTP", true);
      return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verifying...";

    const result = await confirmationResult.confirm(otp);

    verifiedIdToken = await result.user.getIdToken();

    showMessage("OTP verified successfully");

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verified";

    submitBtn.style.display = "block";
    submitBtn.disabled = false;

    submitBtn.textContent = isSignupPage ? "Create Account" : "Login";
  } catch (error) {
    console.error(error);

    verifyOtpBtn.disabled = false;
    verifyOtpBtn.textContent = "Verify OTP";

    if (error.code === "auth/invalid-verification-code") {
      showMessage("Invalid OTP", true);
      return;
    }

    if (error.code === "auth/code-expired") {
      showMessage("OTP expired. Please request a new OTP.", true);
      return;
    }

    if (error.code === "auth/session-expired") {
      showMessage("OTP session expired. Please request OTP again.", true);
      return;
    }

    showMessage("OTP verification failed", true);
  }
});
