import { createContext, useState } from "react";
import { delay } from "../utils/delay";
import { useToast } from "./ToastContext";
import axios from "axios";
import ToastAuthenticated from "../components/Toast/ToastAuthenticated";
import ToastError from "../components/Toast/ToastError";

// const filesData = [
//   {
//     id: "1",
//     name: "Documents",
//     parentId: null,
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "2",
//     name: "Work",
//     parentId: "1",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "3",
//     name: "Projects",
//     parentId: "1",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "4",
//     name: "Resume",
//     parentId: "2",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "5",
//     name: "myresume.pdf",
//     ext: "pdf",
//     parentId: "4",
//     isFolder: false,
//     isStarred: false,
//     isTrash: false,
//     type: "document",
//   },
//   {
//     id: "6",
//     name: "Photos",
//     parentId: "1",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "7",
//     name: "Summer Vacation",
//     parentId: "6",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "8",
//     name: "beach.jpg",
//     ext: "jpg",
//     parentId: "7",
//     isFolder: false,
//     isStarred: false,
//     isTrash: false,
//     type: "image",
//   },
//   {
//     id: "9",
//     name: "mountains.jpg",
//     ext: "jpg",
//     parentId: "7",
//     isFolder: false,
//     isStarred: false,
//     isTrash: false,
//     type: "image",
//   },
//   {
//     id: "10",
//     name: "2025",
//     parentId: "6",
//     isFolder: true,
//     isStarred: false,
//     isTrash: false,
//   },
//   {
//     id: "11",
//     name: "logo.png",
//     ext: "png",
//     parentId: null,
//     isFolder: false,
//     isStarred: false,
//     isTrash: false,
//     type: "image",
//   },
//   {
//     id: "12",
//     name: "todo.txt",
//     ext: "txt",
//     parentId: "1",
//     isFolder: false,
//     isStarred: false,
//     isTrash: false,
//     type: "document",
//   },
// ];
// const filesData = [];

export const FilesFoldersDataContext = createContext();

const FilesFoldersContext = ({ children }) => {
  const toast = useToast();

  async function toggleStar(fileFolder) {
    console.log(fileFolder);
    try {
      // setLoading(true);
      // await delay(1000); // Wait for 1 second
      const fileFolderId = fileFolder._id;
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/asset/${fileFolderId}/star`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        const { isStarred, isFolder } = response.data.data;
        toast.open(
          <ToastAuthenticated
            headline={`${isFolder ? "Folder" : "File"} ${
              isStarred ? "Starred" : "Unstarred"
            }`}
            subHeadline={`We've ${isStarred ? "Starred" : "Unstarred"} ${
              isFolder ? "Folder" : "File"
            }`}
          />
        );
        return true;
      } else {
        console.log("Error");
        return false;
      }
    } catch (error) {
      console.log(error.response.data);

      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Something went wrong";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
      return false;
    } finally {
      // setLoading(false);
    }
  }

  async function toggleTrash(fileFolder) {
    console.log(fileFolder);
    try {
      // setLoading(true);
      // await delay(1000); // Wait for 1 second
      const fileFolderId = fileFolder._id;
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/asset/${fileFolderId}/trash`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        const { isTrash, isFolder } = response.data.data;
        toast.open(
          <ToastAuthenticated
            headline={`${isFolder ? "Folder" : "File"} ${
              isTrash ? "Trashed" : "Untrashed"
            }`}
            subHeadline={`We've ${isTrash ? "Trashed" : "Untrashed"} ${
              isFolder ? "Folder" : "File"
            }`}
          />
        );
        return true;
      } else {
        console.log("Error");
        return false;
      }
    } catch (error) {
      console.log(error.response.data);

      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Something went wrong";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
      return false;
    } finally {
      // setLoading(false);
    }
  }

  return (
    <FilesFoldersDataContext.Provider
      value={{
        //  allDBFiles, setAllDBFiles,
        toggleStar,
        toggleTrash,
      }}
    >
      {children}
    </FilesFoldersDataContext.Provider>
  );
};

export default FilesFoldersContext;
