import express from "express";
import dotenv from "dotenv";
dotenv.config();

import sendEmail from "./email/index.js";
import otpService from "./otpServices.js";
import redis from "./redis.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.post("/otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otpCode = await otpService.generate(email, 6);

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

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  // Check if the OTP is valid
  const otpCode = await redis.get(email);
  if (!otpCode || otpCode !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Delete the OTP from the redis
  await redis.del(email);

  return res.json({ message: "OTP verified successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
