import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("name")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

router.post("/logout", authenticateUser, userController.logoutUser);

router.get("/profile", authenticateUser, userController.getUserProfile);

export default router;
