import { createContext, useState } from "react";

const filesData = [
  {
    id: "1",
    name: "Documents",
    parentId: null,
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "2",
    name: "Work",
    parentId: "1",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "3",
    name: "Projects",
    parentId: "1",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "4",
    name: "Resume",
    parentId: "2",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "5",
    name: "myresume.pdf",
    ext: "pdf",
    parentId: "4",
    isFolder: false,
    isStarred: false,
    isTrash: false,
    type: "document",
  },
  {
    id: "6",
    name: "Photos",
    parentId: "1",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "7",
    name: "Summer Vacation",
    parentId: "6",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "8",
    name: "beach.jpg",
    ext: "jpg",
    parentId: "7",
    isFolder: false,
    isStarred: false,
    isTrash: false,
    type: "image",
  },
  {
    id: "9",
    name: "mountains.jpg",
    ext: "jpg",
    parentId: "7",
    isFolder: false,
    isStarred: false,
    isTrash: false,
    type: "image",
  },
  {
    id: "10",
    name: "2025",
    parentId: "6",
    isFolder: true,
    isStarred: false,
    isTrash: false,
  },
  {
    id: "11",
    name: "logo.png",
    ext: "png",
    parentId: null,
    isFolder: false,
    isStarred: false,
    isTrash: false,
    type: "image",
  },
  {
    id: "12",
    name: "todo.txt",
    ext: "txt",
    parentId: "1",
    isFolder: false,
    isStarred: false,
    isTrash: false,
    type: "document",
  },
];

export const FilesFoldersDataContext = createContext();

const FilesFoldersContext = ({ children }) => {
  const [allDBFiles, setAllDBFiles] = useState(filesData);
  return (
    <FilesFoldersDataContext.Provider value={{ allDBFiles, setAllDBFiles }}>
      {children}
    </FilesFoldersDataContext.Provider>
  );
};

export default FilesFoldersContext;
