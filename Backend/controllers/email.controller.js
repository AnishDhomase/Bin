import { validationResult } from "express-validator";

import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import InvalidTokenModel from "../models/invalidToken.model.js";
import { sendVerificationCode } from "../libs/email.js";
import EmailVerificationTokenModel from "../models/emailVerificationToken.model.js";

export const verifyUserEmail = async (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // get user from the request object (set by authenticateUser middleware)
  const user = req.user;

  // Check if user is already verified
  if (user.isEmailVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  // Destructure the request body
  const { token } = req.body;

  // Check if valid token
  const isTokenExist = await EmailVerificationTokenModel.findOne({
    userId: user._id,
    token,
  });
  if (!isTokenExist) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  // Update isEmailVerified to true
  const savedUser = await UserModel.findOneAndUpdate(
    { _id: user._id }, // filter
    { isEmailVerified: true }, // update
    { new: true } // return the updated doc
  );

  res.status(200).json({ message: "Email verified successfully" });
};

export const sendVerificationTokenToUserEmail = async (req, res, next) => {
  // get user from the request object (set by authenticateUser middleware)
  const user = req.user;

  //   Check if user is already verified
  if (user.isEmailVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }
  // Clear token from db if already exist
  await EmailVerificationTokenModel.deleteOne({ userId: user._id });

  // email verification
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const emailVerificationTokenEntry = EmailVerificationTokenModel.create({
    userId: user._id,
    token: verificationCode,
  });

  sendVerificationCode(user.name, user.email, verificationCode);

  res.status(200).json({ message: "Successfully sent OTP" });
};

export default {
  verifyUserEmail,
  sendVerificationTokenToUserEmail,
};
