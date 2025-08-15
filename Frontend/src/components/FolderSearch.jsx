import TextField from "@mui/material/TextField";
import { useState } from "react";
import { textFieldSx } from "../utils/MUICustomStyles";
import Button from "@mui/material/Button";
import { generateUniqueId } from "../utils/generateUniqueId";
import { getBreadcrumbPath } from "../utils/breadcrumbPath";
import { useToast } from "../contexts/ToastContext";
import ToastError from "./Toast/ToastError";
import { delay } from "../utils/delay";

const FolderSearch = ({
  filesFoldersInCurrDir,
  directory,
  handleNewFolderAddition,
  closeModal,
  inputRef,
}) => {
  const [newFolder, setNewFolder] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (!newFolder) {
      toast.open(
        <ToastError
          headline="Empty Folder name"
          subHeadline="Folder name should not be empty"
        />
      );
      return;
    }
    const newFolderData = {
      name: newFolder,
      parentId: directory.length !== 0 ? directory.at(-1)._id : null,
      // id: generateUniqueId(),
      // isFolder: true,
    };
    handleNewFolderAddition(newFolderData);
    await delay(2000);
    setLoading(false);
    closeModal();
  }

  function handleChange(e) {
    const newFolderName = e.target.value;
    setNewFolder(newFolderName);
    // const exists = filesFoldersInCurrDir.some((fileFolder) => {
    //   if (!fileFolder.isFolder) return false;
    //   return fileFolder.name === newFolderName;
    // });
    // setIsError(exists);
  }
  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-2">
      <TextField
        disabled={loading}
        fullWidth
        required
        value={newFolder}
        inputRef={inputRef}
        onChange={handleChange}
        label="Folder name"
        variant="standard"
        placeholder="Enter folder name"
        sx={{
          input: {
            fontSize: "20px",
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff", // fixes color override in Chrome for disabled inputs
          },
          "input.Mui-disabled": {
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            opacity: 1, // remove MUI dimming
          },
          label: {
            fontSize: "20px",
            color: "#4294FF",
            "&.Mui-focused": {
              color: "#4294FF",
            },
          },
          ".MuiInputLabel-root.Mui-disabled": {
            color: "#4294FF",
            opacity: 1,
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "#ffffff",
          },
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "#4294FF",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#4294FF",
          },
          "& .MuiInput-underline.Mui-disabled:before": {
            borderBottomColor: "#ffffff", // same as enabled
            borderBottomStyle: "solid",
          },
        }}
      />

      <Button
        fullWidth
        // disabled={isError}
        disabled={loading}
        type="submit"
        variant="contained"
        disableElevation
        sx={{
          marginTop: "10px",
          textTransform: "capitalize",
          fontSize: "18px",
          fontWeight: "500",
          color: "#ffffff",
          backgroundColor: "#4294FF",
          padding: "8px 20px",
          "&:hover": {
            backgroundColor: "#376CFB",
          },
          "&.Mui-disabled": {
            backgroundColor: "#4294ffd7", // Disabled background color
            color: "#e0e0e0", // Disabled text color
            cursor: "not-allowed", // Optional: Change cursor
          },
        }}
      >
        {!loading ? "Create" : "Creating ..."}
      </Button>
    </form>
  );
};

export default FolderSearch;
