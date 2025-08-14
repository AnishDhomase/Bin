import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import { MINUTE, rateLimiter } from "../middlewares/rate-limiter.middleware.js";
import { expressValidator } from "../middlewares/bodyValidator.middleware.js";

const router = express.Router();

router.post(
  "/register",
  // rateLimiter(60 * MINUTE, 5),
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("name")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    expressValidator,
  ],
  userController.registerUser
);

router.post(
  "/login",
  rateLimiter(15 * MINUTE, 10),
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    expressValidator,
  ],
  userController.loginUser
);

router.post(
  "/logout",
  rateLimiter(60 * MINUTE, 20),
  authenticateUser,
  userController.logoutUser
);

router.get(
  "/profile",
  rateLimiter(MINUTE, 10),
  authenticateUser,
  userController.getUserProfile
);

router.patch(
  "/email",
  rateLimiter(60 * MINUTE, 5),
  [body("email").isEmail().withMessage("Invalid email"), expressValidator],
  authenticateUser,
  userController.editEmail
);

export default router;
