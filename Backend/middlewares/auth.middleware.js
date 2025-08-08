import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import InvalidTokenModel from "../models/invalidToken.model.js";

// Middleware to authenticate user requests
export const authenticateUser = async (req, res, next) => {
  // Check for token in cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the token is invalidated after logout
  const isTokenInvalid = await InvalidTokenModel.findOne({ token: token });
  if (isTokenInvalid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from id specified in the token
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach user to the request object for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
