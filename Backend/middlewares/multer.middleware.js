import multer from "multer";

export const multerErrorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "File size exceeds the 5MB limit! Please upload a smaller file.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    // Handle other upload errors
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  // No errors, proceed to next middleware
  next();
};
