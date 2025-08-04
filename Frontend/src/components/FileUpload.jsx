import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Alert, Snackbar } from "@mui/material";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]); // Pass files to parent or handle upload here
  };

  const onDropRejected = (fileRejections) => {
    const rejection = fileRejections[0];
    const { errors } = rejection;

    let message = "";
    errors.forEach((error) => {
      if (error.code === "file-too-large") {
        message = "File exceeds maximum size of 2MB.";
      } else if (error.code === "file-invalid-type") {
        message =
          "Invalid file type. Only Images (jpg, png, gif, bmp) and Documents (pdf, doc, docx, txt) are allowed.";
      }
    });

    setErrorMsg(message);
    setOpenSnackbar(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-white ${
          isDragActive
            ? "border-[#4294FF] bg-[#9b8d8d4f]"
            : "border-[#ffffff] bg-[#3e19d309]"
        }`}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon
          sx={{
            fontSize: "60px",
            color: isDragActive ? "#4294FF" : "white",
          }}
        />
        <p
          className={`${
            isDragActive ? "text-[#4294FF]" : "text-white"
          } text-md mt-4 text-center`}
        >
          {isDragActive
            ? "Drop file here..."
            : `Drag & Drop file here or click to select ${
                file ? "another" : ""
              }`}
        </p>
      </div>

      {file && (
        <div className="mt-10 mb-2 flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-md">
          {GetFileIcon(file.name)}
          <div>
            <h2 className="text-lg font-medium">{file.name}</h2>
            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
          </div>
        </div>
      )}

      {/* Show error if such filename already exists and disable button */}
      {/* Show progress of file upload */}

      {file && (
        <Button
          disableElevation
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon sx={{ fontSize: "35px !important" }} />}
          //   onClick={handleUpload}
          sx={{
            textTransform: "capitalize",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "500",
            color: "#ffffff",
            backgroundColor: "#4294FF",
            padding: "4px 20px",
            "&:hover": {
              backgroundColor: "#376CFB",
            },
          }}
        >
          Upload
        </Button>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUpload;

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import Button from "@mui/material/Button";

const GetFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
    return <ImageIcon sx={{ fontSize: 40, color: "#FFA500" }} />;
  } else if (ext === "pdf") {
    return <PictureAsPdfIcon sx={{ fontSize: 40, color: "#FF0000" }} />;
  } else if (["doc", "docx"].includes(ext)) {
    return <DescriptionIcon sx={{ fontSize: 40, color: "#1E90FF" }} />;
  } else if (ext === "txt") {
    return <DescriptionIcon sx={{ fontSize: 40, color: "#808080" }} />;
  } else {
    return <InsertDriveFileIcon sx={{ fontSize: 40, color: "#808080" }} />;
  }
};

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}
