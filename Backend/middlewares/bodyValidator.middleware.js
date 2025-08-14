import { validationResult } from "express-validator";

export const expressValidator = (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errorCode: "VALIDATION_ERROR",
      errors: errors.array(),
    });
  }
  next();
};
