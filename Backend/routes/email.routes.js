import { body } from "express-validator";
import emailController from "../controllers/email.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/verify",
  [
    body("token")
      .isLength({ min: 6, max: 6 })
      .withMessage("Token must be exactly 6 characters long"),
  ],
  authenticateUser,
  emailController.verifyUserEmail
);

router.post(
  "/verification-token",
  authenticateUser,
  emailController.sendVerificationTokenToUserEmail
);

export default router;
