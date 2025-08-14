import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import InvalidTokenModel from "../models/invalidToken.model.js";

// Middleware to authenticate user requests
export const authenticateUser = async (req, res, next) => {
  try {
    // Check for token in cookies or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token missing",
        errorCode: "TOKEN_MISSING",
      });
    }

    // Check if the token is invalidated after logout
    const isTokenInvalid = await InvalidTokenModel.findOne({ token: token });
    if (isTokenInvalid) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token invalidated",
        errorCode: "TOKEN_INVALIDATED",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from id specified in the token
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // Attach user to the request object for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      errorCode: "TOKEN_INVALID",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const emailVerifiedUser = async (req, res, next) => {
  try {
    // Check isEmailVerified of user from the request object
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Please verify your email first",
        errorCode: "EMAIL_NOT_VERIFIED",
      });
    }

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying email",
      errorCode: "EMAIL_VERIFICATION_ERROR",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
