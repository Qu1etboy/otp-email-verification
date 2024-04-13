const otp = require("otp-generator");
const redis = require("./redis");

const EXPIRY_TIME = 60 * 5; // 5 minutes

const generate = async (email, length) => {
  const otpCode = otp.generate(length, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  await redis.set(email, otpCode, "EX", EXPIRY_TIME);

  return otpCode;
};

module.exports = { generate };
