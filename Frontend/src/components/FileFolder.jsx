import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useRef } from "react";
import IconButton from "@mui/material/IconButton";
import { truncateBaseName } from "../utils/truncateName";
import { formatFileSize } from "./FileUpload";
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
  toggleStar,
  toggleTrash,
  searchText = "",
  setSearchText,
  isForFavTrashPage = false,
}) => {
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
      <span className="relative flex items-center text-white w-[400px] gap-2 text-[13px] font-semibold">
        <FileFolderLogo isFolder={file.isFolder} />
        <span>
          {searchText?.length === 0 && truncateBaseName(file.name, 20)}
          {searchText?.length !== 0 && highlightText(file.name, searchText)}
        </span>

        {/* Icons only visible on hover */}
        <div
          className="hidden group-hover:flex items-center pointer-events-none group-hover:pointer-events-auto absolute right-0"
          data-no-dnd="true"
        >
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
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(file);
            }}
          >
            {!file.isStarred ? (
              <i className="ri-star-line text-gold text-[18px] font-thin"></i>
            ) : (
              <i className="ri-star-fill text-gold text-[18px] font-thin"></i>
            )}
          </IconButton>

          <IconButton
            data-no-dnd="true"
            onPointerDown={(e) => e.preventDefault()}
            size="small"
            sx={{
              color: "white",
              transition: "transform 200ms ease-in-out",
              "&:hover": {
                color: "#d43b3b",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleTrash(file);
            }}
          >
            <i className="ri-delete-bin-line text-gold text-[18px] font-light"></i>
          </IconButton>
        </div>
      </span>

      <span className="flex items-center text-gray-300 gap-2 min-w-[140px] text-[13px]">
        {formatDate(file.updatedAt)}
      </span>
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
