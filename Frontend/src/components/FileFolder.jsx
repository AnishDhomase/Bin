import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useRef } from "react";

export const FileFolderLogo = ({ isFolder }) => {
  return (
    <span className="min-w-[70px] flex justify-center">
      <img
        className="h-[60px]"
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
      className="flex items-center text-white gap-2 bg-gray-900 justify-between p-3 rounded-xl cursor-pointer hover:bg-[#1018289a] active:bg-[#66ff7011]"
    >
      <span className="flex items-center text-white gap-2">
        <FileFolderLogo isFolder={file.isFolder} />
        {file.name}
      </span>
      <span className="flex items-center text-white gap-2">50MB</span>
    </li>
  );
};

export default FileFolder;
