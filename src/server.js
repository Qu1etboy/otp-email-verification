const express = require("express");
const otp = require("otp-generator");

const dotenv = require("dotenv");
dotenv.config();

const sendEmail = require("./email");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.post("/otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otpCode = otp.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  try {
    await sendEmail(
      email,
      "OTP Verification",
      `Your OTP is ${otpCode}`,
      `<h1>Your OTP is ${otpCode}</h1>`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
