import { body } from "express-validator";
import emailController from "../controllers/email.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import express from "express";
import { MINUTE, rateLimiter } from "../middlewares/rate-limiter.middleware.js";
import { expressValidator } from "../middlewares/bodyValidator.middleware.js";

const router = express.Router();

router.post(
  "/verify",
  // rateLimiter(MINUTE, 5),
  [
    body("token")
      .isLength({ min: 6, max: 6 })
      .withMessage("Token must be exactly 6 characters long"),
    expressValidator,
  ],
  authenticateUser,
  emailController.verifyUserEmail
);

router.post(
  "/verification-token",
  // rateLimiter(5 * MINUTE, 2),
  authenticateUser,
  emailController.sendVerificationTokenToUserEmail
);

export default router;
