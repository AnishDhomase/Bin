import { validationResult } from "express-validator";

import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import InvalidTokenModel from "../models/invalidToken.model.js";
import { sendVerificationCode } from "../libs/email.js";
import EmailVerificationTokenModel from "../models/emailVerificationToken.model.js";
import mongoose from "mongoose";

export const registerUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Destructure the request body
    const { name, email, password } = req.body;

    // Check if user with the same email already exists
    const isExistingUser = await UserModel.findOne({ email }).session(session);
    if (isExistingUser) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "User already exists",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    // Hash the password
    const hashedPassword = await UserModel.hashPassword(password);

    // Create a new user using createUser user service
    const [user] = await UserModel.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // create email verification token in db
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

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Generate an authentication token for the user
    const token = user.generateAuthToken();

    // Set the token in a cookie
    res.cookie("token", token);

    // send email of verification code
    sendVerificationCode(name, email, verificationCode);

    // Respond with the created user and token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      errorCode: "USER_REGISTRATION_FAILED",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // Destructure the request body
    const { email, password } = req.body;

    // Check if the user exists with the provided credentials
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    // Generate an authentication token for the user
    const token = user.generateAuthToken();

    // Set the token in a cookie
    res.cookie("token", token);

    // Respond with the user details and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      errorCode: "USER_LOGIN_FAILED",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    //   Add this token to the invalid tokens collection
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await InvalidTokenModel.create({ token });

    // Clear the token cookie to log out the user
    res.clearCookie("token");

    // Respond with a success message
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout user",
      errorCode: "USER_LOGOUT_FAILED",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    // respond with the user from the request object (set by authenticateUser middleware)
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
      errorCode: "GET_USER_PROFILE_FAILED",
      error: error.message,
    });
  }
};

export const editEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email: newEmail } = req.body;
    const userId = req.user._id;

    // check if already verified
    if (req.user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Cannot change email.",
        errorCode: "EMAIL_ALREADY_VERIFIED",
      });
    }

    // check if newEmail === prevEmail
    if (req.user.email === newEmail) {
      return res.status(400).json({
        success: false,
        message: "Same email is provided. Cannot change email.",
        errorCode: "SAME_EMAIL",
      });
    }

    // Check if new email is already taken
    const isExistingEmail = await UserModel.findOne({ newEmail }).session(
      session
    );
    if (isExistingEmail) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Email already in use by another account",
        errorCode: "EMAIL_ALREADY_EXISTS",
      });
    }

    // Update email
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { email: newEmail } },
      { session, new: true }
    );

    // Remove old verification tokens for this user
    await EmailVerificationTokenModel.deleteMany({ userId }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to update email",
      errorCode: "EMAIL_UPDATE_FAILED",
      error: error.message,
    });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  editEmail,
};
