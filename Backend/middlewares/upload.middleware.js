import multer from "multer";
import path from "path";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB file size limit

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
    cb(
      new Error("Invalid file type! Only allowed: images, pdf, doc, docx, txt")
    );
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

export default multerUploadMiddleware;
