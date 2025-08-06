import TextField from "@mui/material/TextField";
import { useState } from "react";
import { textFieldSx } from "../utils/MUICustomStyles";
import Button from "@mui/material/Button";
import { generateUniqueId } from "../utils/generateUniqueId";
import { getBreadcrumbPath } from "../utils/breadcrumbPath";

const FolderSearch = ({
  filesFoldersInCurrDir,
  directory,
  handleNewFolderAddition,
  closeModal,
  inputRef,
}) => {
  const [newFolder, setNewFolder] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newFolder) return;
    const newFolderData = {
      name: newFolder,
      id: generateUniqueId(),
      parentId: directory.length !== 0 ? directory.at(-1).id : null,
      isFolder: true,
    };
    handleNewFolderAddition(newFolderData);
    closeModal();
  }

  function handleChange(e) {
    const newFolderName = e.target.value;
    setNewFolder(newFolderName);
    const exists = filesFoldersInCurrDir.some((fileFolder) => {
      if (!fileFolder.isFolder) return false;
      return fileFolder.name === newFolderName;
    });
    setIsError(exists);
  }
  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-2">
      <TextField
        fullWidth
        required
        error={isError}
        value={newFolder}
        inputRef={inputRef}
        onChange={handleChange}
        helperText={
          isError
            ? `Folder "${newFolder}" already exists in ${getBreadcrumbPath(
                directory
              )}`
            : ""
        }
        label="Folder name"
        variant="standard"
        placeholder="Enter folder name"
        sx={textFieldSx}
      />
      <Button
        fullWidth
        disabled={isError}
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
            backgroundColor: "#48494d", // Disabled background color
            color: "#e0e0e0", // Disabled text color
            cursor: "not-allowed", // Optional: Change cursor
          },
        }}
      >
        Create
      </Button>
    </form>
  );
};

export default FolderSearch;
