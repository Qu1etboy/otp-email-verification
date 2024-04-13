import otp from "otp-generator";
import redis from "./redis.js";

const EXPIRY_TIME = 60 * 5; // 5 minutes

export const generate = async (email, length) => {
  const otpCode = otp.generate(length, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  await redis.set(email, otpCode, "EX", EXPIRY_TIME);

  return otpCode;
};

export default { generate };
