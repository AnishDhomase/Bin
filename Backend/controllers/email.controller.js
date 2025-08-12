import { validationResult } from "express-validator";

import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import InvalidTokenModel from "../models/invalidToken.model.js";
import { sendVerificationCode } from "../libs/email.js";
import EmailVerificationTokenModel from "../models/emailVerificationToken.model.js";

export const verifyUserEmail = async (req, res, next) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: errors.array(),
      });
    }

    // get user from the request object (set by authenticateUser middleware)
    const user = req.user;

    // Check if user is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
        errorCode: "EMAIL_ALREADY_VERIFIED",
      });
    }

    // Destructure the request body
    const { token } = req.body;

    // Check if valid token
    const isTokenExist = await EmailVerificationTokenModel.findOne({
      userId: user._id,
      token,
    });
    if (!isTokenExist) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        errorCode: "INVALID_TOKEN",
      });
    }

    // Update isEmailVerified to true
    const savedUser = await UserModel.findOneAndUpdate(
      { _id: user._id }, // filter
      { isEmailVerified: true }, // update
      { new: true } // return the updated doc
    );

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      errorCode: "EMAIL_VERIFICATION_FAILED",
      error: error.message,
    });
  }
};

export const sendVerificationTokenToUserEmail = async (req, res, next) => {
  try {
    // get user from the request object (set by authenticateUser middleware)
    const user = req.user;

    //   Check if user is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
        errorCode: "EMAIL_ALREADY_VERIFIED",
      });
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

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send verification token",
      errorCode: "SEND_VERIFICATION_TOKEN_FAILED",
      error: error.message,
    });
  }
};

export default {
  verifyUserEmail,
  sendVerificationTokenToUserEmail,
};
