import { validationResult } from "express-validator";

import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import InvalidTokenModel from "../models/invalidToken.model.js";
import { sendVerificationCode } from "../libs/email.js";
import EmailVerificationTokenModel from "../models/emailVerificationToken.model.js";
import mongoose from "mongoose";

export const verifyUserEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // get user from the request object (set by authenticateUser middleware)
    const user = req.user;

    // Check if user is already verified
    if (user.isEmailVerified) {
      await session.abortTransaction();
      session.endSession();
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
    }).session(session);
    if (!isTokenExist) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        success: false,
        message: "OTP has not matched",
        errorCode: "INVALID_OTP",
      });
    }

    // Update isEmailVerified to true
    const savedUser = await UserModel.findOneAndUpdate(
      { _id: user._id }, // filter
      { isEmailVerified: true }, // update
      { new: true, session } // return the updated doc
    );

    // Delete used token
    await EmailVerificationTokenModel.deleteOne(
      { userId: user._id },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: savedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      errorCode: "EMAIL_VERIFICATION_FAILED",
      error: error.message,
    });
  }
};

export const sendVerificationTokenToUserEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // get user from the request object (set by authenticateUser middleware)
    const user = req.user;

    //   Check if user is already verified
    if (user.isEmailVerified) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
        errorCode: "EMAIL_ALREADY_VERIFIED",
      });
    }
    // Clear token from db if already exist
    await EmailVerificationTokenModel.deleteOne(
      { userId: user._id },
      { session }
    );

    // email verification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const emailVerificationTokenEntry =
      await EmailVerificationTokenModel.create(
        [
          {
            userId: user._id,
            token: verificationCode,
          },
        ],
        { session }
      );

    await session.commitTransaction();
    session.endSession();

    // Send email
    sendVerificationCode(user.name, user.email, verificationCode);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
