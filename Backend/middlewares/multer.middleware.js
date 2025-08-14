import multer from "multer";
import path from "path";

const allowedMimeTypes = [
  // Common raster formats
  "image/jpeg", // .jpg, .jpeg
  "image/jpg", // .jpg, .jpeg
  "image/png", // .png
  "image/gif", // .gif

  // Vector formats
  "image/svg+xml", // .svg

  // 📄 Documents
  "application/pdf", // .pdf
];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB file size limit

// set multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//file filter function
const checkFileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

// Multer middleware
const multerUploadMiddleware = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Utility function for consistent error responses
const sendErrorResponse = (
  res,
  statusCode,
  message,
  errorCode = "UPLOAD_ERROR"
) => {
  return res.status(statusCode).json({
    success: false,
    errorCode,
    message,
    timestamp: new Date().toISOString(),
  });
};

// Error handling middleware for multer
export const multerErrorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return sendErrorResponse(
          res,
          400,
          `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit!`,
          "FILE_TOO_LARGE"
        );
      case "LIMIT_UNEXPECTED_FILE":
        return sendErrorResponse(
          res,
          400,
          "Invalid file type",
          "INVALID_FILE_TYPE"
        );
      default:
        return sendErrorResponse(res, 400, err.message, "MULTER_ERROR");
    }
  } else if (err) {
    return sendErrorResponse(
      res,
      400,
      err.message || "File upload failed",
      "UPLOAD_ERROR"
    );
  }
  next();
};

export default multerUploadMiddleware;
