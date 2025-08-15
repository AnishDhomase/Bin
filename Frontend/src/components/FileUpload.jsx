import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Alert, CircularProgress, Snackbar } from "@mui/material";

const FileUpload = ({ directory, handleNewFileUpload, closeModal }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // DropZone file selection
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  };

  const onDropRejected = (fileRejections) => {
    const rejection = fileRejections[0];
    const { errors } = rejection;

    let message = "";
    errors.forEach((error) => {
      if (error.code === "file-too-large") {
        message = "File exceeds maximum size of 2MB.";
        toast.open(
          <ToastError headline="Too large file" subHeadline={message} />
        );
      } else if (error.code === "file-invalid-type") {
        message = "This file type isn't supported";
        toast.open(
          <ToastError headline="Invalid file type" subHeadline={message} />
        );
      } else {
        message = "Can't select file due to error";
        toast.open(
          <ToastError headline="Invalid file type" subHeadline={message} />
        );
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
      "application/pdf": [".pdf"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  // file upload
  async function handleUpload() {
    setLoading(true);
    await delay(1000); // Wait for 1 second

    if (!file) {
      toast.open(
        <ToastError
          headline="No file Selected"
          subHeadline="Select file to upload"
        />
      );
      return;
    }

    const parentId = getParentIdFromDirectory(directory);
    const newFileData = { file, parentId };

    handleNewFileUpload(newFileData);
    await delay(2000);
    setLoading(false);
    closeModal();
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`hover:bg-[#ffffff14] border-2 border-dashed rounded-xl px-6 py-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-white ${
          isDragActive
            ? "border-[#ffffff] bg-[#3e19d309]"
            : "border-[#4294FF] bg-[#9b8d8d2b]"
        }`}
      >
        <input {...getInputProps()} disabled={loading} />
        <CloudUploadIcon
          sx={{
            fontSize: "45px",
            color: isDragActive ? "white" : "#4294FF",
          }}
        />
        <p
          className={`${
            isDragActive ? "text-white" : "text-[#4294FF]"
          } text-md mt-1 text-center font-semibold`}
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
            <h2 className="text-[15px] font-medium">
              {shortenFileName(file.name)}
            </h2>
            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
          </div>
        </div>
      )}

      {/* Show progress of file upload */}
      {file && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          disableElevation
          variant="contained"
          color="primary"
          startIcon={
            !loading ? (
              <CloudUploadIcon sx={{ fontSize: "35px !important" }} />
            ) : (
              ""
            )
          }
          sx={{
            textTransform: "capitalize",
            fontSize: "18px",
            color: "white",
            fontWeight: "500",
            padding: "8px 15px",
            height: "100%",
            "&.Mui-disabled": {
              backgroundColor: "#289afdc1",
            },
          }}
        >
          {!loading ? (
            "Upload"
          ) : (
            <CircularProgress
              size="32px"
              sx={{
                color: "white",
              }}
            />
          )}
        </Button>
      )}
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
import { useToast } from "../contexts/ToastContext";
import ToastError from "./Toast/ToastError";
import { delay } from "../utils/delay";
import { getParentIdFromDirectory } from "./DashboardMain";
import axios from "axios";

export const GetFileIcon = (fileName) => {
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

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

function shortenFileName(fileName, maxLength = 30) {
  if (fileName.length <= maxLength) return fileName;

  const extIndex = fileName.lastIndexOf(".");
  const ext = extIndex !== -1 ? fileName.slice(extIndex) : "";
  const name = extIndex !== -1 ? fileName.slice(0, extIndex) : fileName;

  const charsToShow = maxLength - ext.length - 3; // 3 for "..."
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return `${name.slice(0, frontChars)}...${name.slice(-backChars)}${ext}`;
}
