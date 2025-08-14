import multer from "multer";

export const multerErrorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        errorCode: "FILE_TOO_LARGE",
        message:
          "File size exceeds the 5MB limit! Please upload a smaller file.",
        details: null,
      });
    }
    return res.status(400).json({
      success: false,
      errorCode: "MULTER_ERROR",
      message: err.message,
      details: { code: err.code },
    });
  }
  if (err) {
    // Handle other upload errors
    return res.status(400).json({
      success: false,
      errorCode: "UPLOAD_ERROR",
      message: err.message || "An unexpected upload error occurred.",
      details: null,
    });
  }
  // No errors, proceed to next middleware
  next();
};
