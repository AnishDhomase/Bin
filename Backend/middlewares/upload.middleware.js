import multer from "multer";
import path from "path";

const allowedMimeTypes = [
  // Common raster formats
  "image/jpeg", // .jpg, .jpeg
  "image/jpg", // .jpg, .jpeg
  "image/png", // .png
  "image/gif", // .gif
  "image/bmp", // .bmp
  "image/webp", // .webp
  "image/tiff", // .tif, .tiff
  "image/x-icon", // .ico

  // Vector formats
  "image/svg+xml", // .svg
  "image/heic", // HEIC (Apple high-efficiency image)
  "image/heif", // HEIF

  // 📄 Documents
  "application/pdf", // .pdf

  // Word
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx

  // Excel
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx

  // PowerPoint
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

  // Text
  "text/plain", // .txt
  "text/csv", // .csv

  // OpenDocument formats
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/vnd.oasis.opendocument.presentation", // .odp
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
