import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useRef } from "react";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export const FileFolderLogo = ({ isFolder, height = 60 }) => {
  return (
    <span className="min-w-[70px] flex justify-center">
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

const FileFolder = ({ file, setDirectory }) => {
  const { setNodeRef: setDropRef } = useDroppable({
    id: file.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: file.id,
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
      className="group flex items-center text-white gap-2 bg-gray-900 justify-between p-3 rounded-xl cursor-pointer hover:bg-[#1018289a]" //active:bg-[#66ff7011]
    >
      <span className="relative flex items-center text-white gap-2 w-[400px]">
        <FileFolderLogo isFolder={file.isFolder} />
        {truncateBaseName(file.name, 25)}
        {/* Icons only visible on hover */}
        <div
          className="hidden group-hover:flex items-center gap-1 pointer-events-none group-hover:pointer-events-auto absolute right-2"
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
              console.log("clicked");
            }}
          >
            <StarBorderOutlinedIcon fontSize="small" />
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
              console.log("clicked");
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </div>
      </span>

      <span className="flex items-center text-white gap-2">
        02/07/2003 - 17:15
      </span>
      <span className="flex items-center text-white gap-2">50MB</span>
    </li>
  );
};

export default FileFolder;

function truncateBaseName(fullName, maxBaseLen) {
  const dot = fullName.lastIndexOf(".");
  const hasExt = dot > 0 && dot < fullName.length - 1;
  const base = hasExt ? fullName.slice(0, dot) : fullName;
  const ext = hasExt ? fullName.slice(dot) : "";

  if (base.length <= maxBaseLen) {
    return fullName;
  }

  const truncated = base.slice(0, maxBaseLen) + "..." + ext;
  return truncated;
}
