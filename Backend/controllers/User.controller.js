import { validationResult } from "express-validator";

import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import InvalidTokenModel from "../models/invalidToken.model.js";

export const registerUser = async (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure the request body
  const { name, email, password } = req.body;

  // Check if user with the same email already exists
  const isExistingUser = await UserModel.findOne({ email });
  if (isExistingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await UserModel.hashPassword(password);

  // Create a new user using createUser user service
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate an authentication token for the user
  const token = user.generateAuthToken();

  // Respond with the created user and token
  res.status(201).json({ user, token });
};

export const loginUser = async (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure the request body
  const { email, password } = req.body;

  // Check if the user exists with the provided credentials
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate an authentication token for the user
  const token = user.generateAuthToken();

  // Set the token in a cookie
  res.cookie("token", token);

  // Respond with the user details and token
  res.status(200).json({ user, token });
};

export const logoutUser = async (req, res, next) => {
  //   Add this token to the invalid tokens collection
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await InvalidTokenModel.create({ token });

  // Clear the token cookie to log out the user
  res.clearCookie("token");

  // Respond with a success message
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUserProfile = async (req, res, next) => {
  // respond with the user from the request object (set by authenticateUser middleware)
  res.status(200).json(req.user);
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};
