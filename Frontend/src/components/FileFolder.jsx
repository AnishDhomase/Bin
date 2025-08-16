import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useContext, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import { truncateBaseName } from "../utils/truncateName";
import { formatFileSize } from "./FileUpload";
import FilesFoldersContext, {
  FilesFoldersDataContext,
} from "../contexts/FilesFoldersContext";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { Tooltip } from "@mui/material";
export const FileFolderLogo = ({ isFolder, height = 30 }) => {
  return (
    <span className="min-w-[50px] flex justify-center">
      <img
        style={{
          height: `${height}px`,
        }}
        src={isFolder ? "/images/folderIcon.png" : "/images/fileIcon.png"}
        alt="fileFolder"
      />
    </span>
  );
};

const FileFolder = ({
  file,
  setDirectory,
  handleFileStar,
  handleFileTrash,
  isTrashPage = false,
  searchText = "",
  setSearchText,
  isForFavTrashPage = false,
}) => {
  const { toggleStar, toggleTrash } = useContext(FilesFoldersDataContext);

  const { setNodeRef: setDropRef } = useDroppable({
    id: file._id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: file._id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const startPoint = useRef(null);

  const handleMouseDown = (e) => {
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e) => {
    if (!startPoint.current) return;

    const dx = Math.abs(e.clientX - startPoint.current.x);
    const dy = Math.abs(e.clientY - startPoint.current.y);

    const dragThreshold = 5; // px movement threshold

    if (dx < dragThreshold && dy < dragThreshold) {
      // Considered as a click
      if (file.isFolder) {
        setSearchText("");
        if (!isForFavTrashPage)
          setDirectory((directory) => [...directory, file]);
      }
    }

    startPoint.current = null;
  };

  const combinedRef = (node) => {
    if (file.isFolder) setDropRef(node);
    setDragRef(node);
  };

  async function handleStarToggle(e, fileFolder) {
    console.log(fileFolder);
    e.preventDefault();
    const success = await toggleStar(fileFolder);
    if (success) handleFileStar(fileFolder);
  }
  async function handleTrashToggle(e, fileFolder) {
    console.log(fileFolder);
    e.preventDefault();
    const success = await toggleTrash(fileFolder);
    if (success) handleFileTrash(fileFolder);
  }

  return (
    <li
      ref={combinedRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="group flex items-center text-white gap-2 bg-[#03081f6e] justify-between py-2 px-1 rounded-xl cursor-pointer hover:bg-[#1018289a]" //active:bg-[#66ff7011]
    >
      {/* Icon and Name */}
      <span className="relative flex items-center text-white w-[400px] gap-2 text-[13px] font-semibold">
        {/* Icon */}
        <FileFolderLogo isFolder={file.isFolder} />

        {/* Name */}
        <span>
          {searchText?.length === 0 && truncateBaseName(file.name, 20)}
          {searchText?.length !== 0 && highlightText(file.name, searchText)}
        </span>

        {/* Icons only visible on hover */}
        <div
          className="hidden group-hover:flex items-center pointer-events-none group-hover:pointer-events-auto absolute right-0"
          data-no-dnd="true"
        >
          {!isTrashPage && (
            <IconButton
              data-no-dnd="true"
              onPointerDown={(e) => e.preventDefault()}
              size="small"
              sx={{
                color: "white",
                transition: "transform 200ms ease-in-out",
                "&:hover": {
                  color: "#FFD700",
                },
              }}
              onClick={(e) => handleStarToggle(e, file)}
            >
              <Tooltip title={`${!file.isStarred ? "Star" : "Unstar"}`}>
                {!file.isStarred ? (
                  <i className="ri-star-line text-gold text-[18px] font-thin"></i>
                ) : (
                  <i className="ri-star-fill text-gold text-[18px] font-thin"></i>
                )}
              </Tooltip>
            </IconButton>
          )}

          <IconButton
            data-no-dnd="true"
            onPointerDown={(e) => e.preventDefault()}
            size="small"
            sx={{
              color: "white",
              transition: "transform 200ms ease-in-out",
              "&:hover": {
                color: !isTrashPage ? "#d43b3b" : "#3bd45e",
              },
            }}
            onClick={(e) => handleTrashToggle(e, file)}
          >
            <Tooltip title={`${!isTrashPage ? "Delete" : "Restore"}`}>
              {!isTrashPage ? (
                <i className="ri-delete-bin-line text-gold text-[18px] font-light"></i>
              ) : (
                <RestoreFromTrashIcon sx={{ fontSize: 20 }} />
              )}
            </Tooltip>
          </IconButton>
        </div>
      </span>

      {/* Updated At */}
      <span className="flex items-center text-gray-300 gap-2 min-w-[140px] text-[13px]">
        {formatDate(file.updatedAt)}
      </span>

      {/* Size */}
      <span className="flex items-center text-gray-300 gap-2  min-w-[65px] text-[13px]">
        {file.isFolder ? "" : formatFileSize(file.cloudinaryAssetId.size)}
      </span>
    </li>
  );
};

export default FileFolder;

function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(
    `(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "ig"
  );
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-300 text-black">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
