import { useCallback, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FileFolder, { FileFolderLogo } from "../components/FileFolder";
import Search from "../components/Search";
import AddIcon from "@mui/icons-material/Add";
import LinearProgress from "@mui/material/LinearProgress";
import Breadcrumb from "./Breadcrumb";
import { DndContext } from "@dnd-kit/core";
import MyModal from "./MyModal";
import FolderSearch from "./FolderSearch";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FileUpload from "./FileUpload";
import { FilesFoldersDataContext } from "../contexts/FilesFoldersContext";
import { Box, IconButton, Modal } from "@mui/material";
import { getBreadcrumbPath } from "../utils/breadcrumbPath";
import { useToast } from "../contexts/ToastContext";
import { delay } from "../utils/delay";
import axios from "axios";
import ToastError from "./Toast/ToastError";
import ToastAuthenticated from "./Toast/ToastAuthenticated";
import FileViewer from "./FileViewer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "#353742",
  borderRadius: "16px",
  boxShadow: 24,
  p: 6,
  minHeight: 450,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const DashboardMain = () => {
  const {
    // allDBFiles,
    // setAllDBFiles,
    toggleStar,
    toggleTrash,
  } = useContext(FilesFoldersDataContext);
  const [directory, setDirectory] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);
  const toast = useToast();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(null);
  const [overId, setOverId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const isPDFFileOpen = fileOpen?.cloudinaryAssetId?.format === "pdf";

  // When directory changes make searchText empty
  useEffect(() => {
    setSearchText("");
  }, [directory]);

  // Load content in current directory
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 200));
      await delay(200);

      const parentId = getParentIdFromDirectory(directory);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/asset`,
        {
          params: parentId ? { parentId } : {},
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success === true) {
        const fetchedItems = response.data.data;
        setFiles(
          () => fetchedItems
          // allDBFiles.filter(
          //   (file) =>
          //     file.parentId ===
          //       (directory.length === 0 ? null : directory.at(-1)?.id) &&
          //     !file.isTrash
          // )
        );
      } else {
        console.log("");
      }
    } catch (error) {
      console.log(error.response.data);

      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Unable to fetch";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  }, [directory]);

  useEffect(() => {
    fetchFiles();
  }, [
    directory,
    fetchFiles,
    // toast,
    // allDBFiles
  ]);

  // Drag and Drop
  async function handleDragEnd(event) {
    try {
      setOverId(null);
      setDragActive(null);
      setLoading(true);
      // await delay(1000); // Wait for 1 second

      const { active, over } = event;
      console.log({ active, over });
      if (!over) return;

      const draggingfileFolderId = active.id;
      const droppingFolderId = over.id;
      if (draggingfileFolderId === droppingFolderId) return;

      const droppingItem = files.filter(
        (item) => item._id === droppingFolderId
      );
      console.log(droppingItem);
      if (!droppingItem[0].isFolder) {
        return;
      }

      // Request backend
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASE_URL
        }/asset/${draggingfileFolderId}/relocate`,
        {
          newParentId: droppingFolderId,
        },
        {
          withCredentials: true, // send cookies / auth headers
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        toast.open(
          <ToastAuthenticated
            headline="Moved successfully"
            subHeadline="We've moved it successfully"
          />
        );
        // Update files
        setFiles((files) =>
          files.filter((item) => item._id !== draggingfileFolderId)
        );
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error.response.data);
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Error moving in";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  }

  // New Folder Addition
  async function handleNewFolderAddition(newFolderData) {
    // setAllDBFiles((allDBFiles) => [...allDBFiles, newFolder]);
    try {
      setLoading(true);
      // await delay(2000); // Wait for 1 second

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/asset/folder`,
        newFolderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        fetchFiles();
        await delay(2300); // Wait for 1 second
        toast.open(
          <ToastAuthenticated
            headline="Folder Created"
            subHeadline="New folder created"
          />
        );
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error.response.data);
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Folder creation failed";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  }
  // New File Addition
  async function handleNewFileUpload(newFileData) {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/asset/file`,
        newFileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        fetchFiles();
        await delay(2300); // Wait for 1 second
        toast.open(
          <ToastAuthenticated
            headline="File uploaded"
            subHeadline="We've uploaded your file"
          />
        );
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error.response.data);
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Error uploading file";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  }
  // FileFolder Star
  async function handleFileStar(fileFolderToToggle) {
    setFiles((files) =>
      files.map((item) =>
        item._id !== fileFolderToToggle._id
          ? item
          : { ...item, isStarred: !item.isStarred }
      )
    );
  }
  // FileFolder Trash
  async function handleFileTrash(fileFolderToTrash) {
    setFiles((files) =>
      files.filter((item) => item._id !== fileFolderToTrash._id)
    );
  }

  return (
    <main className="p-8">
      {/* back Button and Heading of page */}
      <header className="w-5/6 mx-auto flex gap-2 mb-8 items-center justify-start">
        <IconButton
          aria-label="delete"
          sx={{
            padding: 0,
          }}
        >
          <i className="ri-home-4-line text-white"></i>
        </IconButton>

        {/* Title of page */}
        <h1 className="text-white text-2xl font-semibold">Home</h1>
      </header>

      {/* Storage analytics */}
      <header className=" w-5/6 mx-auto mb-5">
        <main className="h-[250px] bg-gray-900 rounded-xl p-5">
          <h1 className="text-white text-xl">
            Storage overview will be implemented here soon ...
          </h1>
        </main>
      </header>

      {/* Main */}
      <main className="w-5/6 mx-auto bg-gray-800 py-10 rounded-xl min-h-[450px]">
        <div className="flex flex-col">
          {/* Search bar + Upload File + Create Folder */}
          <section className="flex justify-between items-center gap-2 w-3/4 mx-auto">
            <Search
              files={files}
              setSearchedForFiles={setSearchedForFiles}
              searchText={searchText}
              setSearchText={setSearchText}
            />

            {/* Upload file and Add folder Modals */}
            <span className="flex gap-1.5 items-center">
              {/* Upload files Modal */}
              <MyModal
                btn={
                  <Button
                    variant="outlined"
                    startIcon={
                      <CloudUploadOutlinedIcon
                        sx={{ fontSize: "25px !important" }}
                        color="inherit"
                      />
                    }
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      justifyContent: "start",
                      fontSize: "16px",
                      color: "white",
                      padding: "5px 10px",
                      border: "2px solid #ffffff1a",
                    }}
                  >
                    Upload
                  </Button>
                }
              >
                {/* <FileFolderLogo isFolder={false} /> */}
                <h1 className="text-[#376CFB] font-semibold text-2xl text-center">
                  Upload File
                </h1>

                <div className="text-center mt-8 mb-3">
                  <p className="text-gray-300 text-base">
                    Allowed types:{" "}
                    <span className="font-medium text-white">Images</span> (jpg,
                    jpeg, png, gif, svg),
                    <span className="font-medium text-white">
                      {" "}
                      Documents
                    </span>{" "}
                    (pdf).
                  </p>
                  <p className="text-gray-300 text-base mt-2">
                    Max file size:{" "}
                    <span className="font-medium text-white">2MB</span>
                  </p>
                </div>
                <FileUpload
                  directory={directory}
                  handleNewFileUpload={handleNewFileUpload}
                />
              </MyModal>

              {/* Add new folder Modal */}
              <MyModal
                btn={
                  <Button
                    variant="outlined"
                    startIcon={
                      <AddIcon
                        sx={{ fontSize: "25px !important" }}
                        color="inherit"
                      />
                    }
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      justifyContent: "start",
                      fontSize: "16px",
                      color: "white",
                      padding: "5px 10px",
                      border: "2px solid #ffffff1a",
                    }}
                  >
                    Create
                  </Button>
                }
              >
                <FileFolderLogo isFolder={true} />
                <h1 className="text-white font-semibold text-3xl text-center mt-1">
                  Create Folder
                </h1>
                <FolderSearch
                  filesFoldersInCurrDir={files}
                  directory={directory}
                  handleNewFolderAddition={handleNewFolderAddition}
                />
              </MyModal>
            </span>
          </section>

          {/* Breadcrumb */}
          <header className="text-white text-xl font-semibold w-3/4 mx-auto mt-10">
            <div
              className="bg-gray-900 px-4 py-1 rounded-md flex gap-1 text-gray-400 overflow-x-auto whitespace-nowrap custom-scrollbar items-center"
              onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              <Breadcrumb directory={directory} setDirectory={setDirectory} />
            </div>
          </header>

          {/* Loading indicator */}
          {loading && (
            <div className="w-3/4 mx-auto mt-4">
              <LinearProgress />
            </div>
          )}

          {/* Title: Name, Last Modified, Size */}
          {((searchText.length === 0 && files.length !== 0) ||
            searchedForFiles.length !== 0) && (
            <div className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-6 -mb-2">
              <li className="group flex items-center text-white gap-2 bg-gray-900 justify-between py-1 px-1 pl-3 rounded-lg">
                <span className="relative flex items-center text-white w-[400px] gap-2 text-[13px]">
                  Name
                </span>
                <span className="flex items-center text-white gap-2 min-w-[140px] text-[13px]">
                  Last Modified
                </span>
                <span className="flex items-center text-white gap-2  min-w-[65px] text-[13px]">
                  Size
                </span>
              </li>
            </div>
          )}
          {/* If no searchText allow drag and drop */}
          {searchText.length === 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              <DndContext
                onDragEnd={handleDragEnd}
                onDragOver={({ over }) => setOverId(over?.id || null)}
                onDragStart={({ active }) =>
                  setDragActive(active ? true : false)
                }
              >
                {files.map((file) => (
                  <FileFolder
                    key={file._id}
                    file={file}
                    setDirectory={setDirectory}
                    handleFileStar={handleFileStar}
                    handleFileTrash={handleFileTrash}
                    setFileOpen={setFileOpen}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    isOver={overId === file._id}
                    isDragActive={dragActive}
                  />
                ))}
              </DndContext>
            </ul>
          )}

          {/* If no searchText and no files/folders in current directory*/}
          {!loading && searchText.length === 0 && files.length === 0 && (
            <h1 className="w-3/4 p-4 rounded-xl bg-[#0000006b] mx-auto mt-4 font-semibold text-md text-[#4294FF] text-center">
              Folder is empty. Add{" "}
              <span className="text-white ml-1">"Files"</span> or{" "}
              <span className="text-white ml-1">"Folders"</span> here to get
              started
            </h1>
          )}

          {/* If searchText present 1. don't allow drag and drop 2. heighlight results with query text*/}
          {searchText.length !== 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              {searchedForFiles.map((file) => (
                <FileFolder
                  key={file.id}
                  file={file}
                  setDirectory={setDirectory}
                  handleFileStar={handleFileStar}
                  handleFileTrash={handleFileTrash}
                  setFileOpen={setFileOpen}
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              ))}
            </ul>
          )}

          {/* If searchText present but no results found */}
          {searchText.length !== 0 && searchedForFiles.length === 0 && (
            <h1 className="w-3/4 p-4 rounded-xl bg-[#0000006b]  mx-auto mt-4 font-semibold text-md text-[#4294FF] text-center">
              Ooops! We couldn’t find anything for
              <span className="text-white ml-1">"{searchText}"</span> in
              <span className="text-white ml-1">
                "{collapseBreadcrumbPath(getBreadcrumbPath(directory))}"
              </span>
            </h1>
          )}
        </div>
      </main>

      <Modal
        open={fileOpen !== null}
        onClose={() => setFileOpen(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ outline: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(6, 7, 22, 0.762)", // semi-transparent dark
              backdropFilter: "blur(16px)", // blur effect
            },
          },
        }}
      >
        <div
          className={`outline-none ${
            isPDFFileOpen ? "w-[850px]" : ""
          } p-0 m-auto`}
        >
          {isPDFFileOpen && (
            <iframe
              src={fileOpen?.cloudinaryAssetId?.url}
              width="100%"
              height="580px"
              title="PDF Viewer"
              style={{
                borderRadius: "12px", // rounded corners
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // shadow
                backgroundColor: "#f9f9f9", // background behind iframe content
              }}
              sandbox
            />
          )}
          {!isPDFFileOpen && (
            <div className="flex flex-col items-center p-4 rounded-lg shadow-lg ">
              <img
                src={fileOpen?.cloudinaryAssetId?.url}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md"
              />
              <a
                href={fileOpen?.cloudinaryAssetId?.downloadUrl}
                download
                className="mt-6
    inline-flex items-center
    bg-gradient-to-r from-teal-700 via-cyan-600 to-blue-500
    text-white font-semibold text-lg
    px-3 py-1
    rounded-xl
    shadow-lg
    hover:scale-101 hover:shadow-xl
    transition-transform duration-200 ease-out
  "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 7v8m0 0l3-3m-3 3l-3-3"
                  />
                </svg>
                Download
              </a>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
};

export default DashboardMain;

function collapseBreadcrumbPath(fullPath) {
  const parts = fullPath.split("/").filter(Boolean);
  if (parts.length <= 2) return fullPath;

  const first = parts[0];
  const last = parts[parts.length - 1];
  const leading = fullPath.startsWith("/") ? "/" : "";
  const trailing = fullPath.endsWith("/") ? "/" : "";

  return `${leading}${first}/../${last}${trailing}`;
}

export function getParentIdFromDirectory(directory) {
  const parentId = directory.length === 0 ? null : directory.at(-1)?._id;
  return parentId;
}
