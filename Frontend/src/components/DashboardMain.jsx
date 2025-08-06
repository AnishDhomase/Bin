import { useContext, useEffect, useState } from "react";
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
import { IconButton } from "@mui/material";
import { getBreadcrumbPath } from "../utils/breadcrumbPath";

const DashboardMain = () => {
  const { allDBFiles, setAllDBFiles, toggleStar, toggleTrash } = useContext(
    FilesFoldersDataContext
  );
  const [directory, setDirectory] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);

  useEffect(() => {
    setSearchText("");
  }, [directory]);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles(() =>
        allDBFiles.filter(
          (file) =>
            file.parentId ===
              (directory.length === 0 ? null : directory.at(-1)?.id) &&
            !file.isTrash
        )
      );
      setLoading(false);
    };

    fetchFiles();
  }, [directory, allDBFiles]);

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log({ active, over });

    if (!over) return;

    const draggingfileFolderId = active.id;
    const droppingFolderId = over.id;
    if (draggingfileFolderId === droppingFolderId) return;

    // Check for droppingFolder folder/file already contains draggingfileFolder
    const draggingItem = allDBFiles.find(
      (item) => item.id === draggingfileFolderId
    );
    const itemsInDroppingFolder = allDBFiles.filter(
      (item) =>
        item.parentId === droppingFolderId &&
        item.isFolder === draggingItem.isFolder
    );
    const isItemAlreadyExistInDroppingFolder = itemsInDroppingFolder.some(
      (item) => item.name === draggingItem.name
    );
    if (isItemAlreadyExistInDroppingFolder)
      return alert(
        `Can't move "${draggingItem.name}" ${
          draggingItem.isFolder ? "Folder" : "File"
        } because such file already exist in it.`
      );

    setAllDBFiles((files) =>
      files.map((file) =>
        file.id === draggingfileFolderId
          ? {
              ...file,
              parentId: droppingFolderId,
            }
          : file
      )
    );
  }

  function handleNewFolderAddition(newFolder) {
    setAllDBFiles((allDBFiles) => [...allDBFiles, newFolder]);
  }

  return (
    <main className="bg-[#1c2331] w-4/5 p-8">
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
      <header className=" w-5/6 mx-auto mb-5">
        <main className="h-[250px] bg-gray-900 rounded-xl p-5">
          <h1 className="text-white text-xl">
            Storage overview will be implemented here soon ...
          </h1>
        </main>
      </header>
      <main className="w-5/6 mx-auto bg-gray-800 py-10 rounded-xl min-h-3/5">
        <div className="flex flex-col">
          <section className="flex justify-between content-center gap-2 w-3/4 mx-auto items-center">
            <Search
              files={files}
              setSearchedForFiles={setSearchedForFiles}
              searchText={searchText}
              setSearchText={setSearchText}
            />

            {/* Upload file and Add folder Modals */}
            <span className="flex gap-1.5">
              {/* Upload files Modal */}
              <MyModal
                btn={
                  <Button
                    variant="outlined"
                    startIcon={
                      <CloudUploadOutlinedIcon
                        sx={{ fontSize: "35px !important" }}
                        color="inherit"
                      />
                    }
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      justifyContent: "start",
                      fontSize: "16px",
                      color: "white",
                      padding: "8px 15px",
                      border: "2px solid #ffffff1a",
                      height: "100%",
                    }}
                  >
                    Upload
                  </Button>
                }
              >
                {/* <FileFolderLogo isFolder={false} /> */}
                <h1 className="text-[#376CFB] font-semibold text-3xl text-center mt-1">
                  Upload File
                </h1>
                <div className="text-center space-y-2 my-7">
                  <p className="text-gray-300 text-base">
                    Allowed types:{" "}
                    <span className="font-medium text-white">Images</span> (jpg,
                    png, gif, bmp),
                    <span className="font-medium text-white">
                      {" "}
                      Documents
                    </span>{" "}
                    (pdf, doc, docx, txt).
                  </p>
                  <p className="text-gray-300 text-base">
                    Max file size:{" "}
                    <span className="font-medium text-white">2MB</span>
                  </p>
                </div>
                <FileUpload />
              </MyModal>

              {/* Add new folder Modal */}
              <MyModal
                btn={
                  <Button
                    variant="outlined"
                    startIcon={
                      <AddIcon
                        sx={{ fontSize: "35px !important" }}
                        color="inherit"
                      />
                    }
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      justifyContent: "start",
                      fontSize: "16px",
                      color: "white",
                      padding: "10px 20px",
                      border: "2px solid #ffffff1a",
                      height: "100%",
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
          <header className="text-white text-2xl font-semibold w-3/4 mx-auto mt-10">
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

          {/* If no searchText allow drag and drop */}
          {searchText.length === 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              <DndContext onDragEnd={handleDragEnd}>
                {files.map((file) => (
                  <FileFolder
                    key={file.id}
                    file={file}
                    setDirectory={setDirectory}
                    toggleStar={toggleStar}
                    toggleTrash={toggleTrash}
                    searchText={searchText}
                    setSearchText={setSearchText}
                  />
                ))}
              </DndContext>
            </ul>
          )}

          {/* If no searchText and no files/folders in current directory*/}
          {!loading && searchText.length === 0 && files.length === 0 && (
            <h1 className="w-3/4 bg-gray-800 mx-auto mt-4 font-semibold text-xl text-[#4294FF]">
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
                  toggleStar={toggleStar}
                  toggleTrash={toggleTrash}
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              ))}
            </ul>
          )}

          {/* If searchText present but no results found */}
          {searchText.length !== 0 && searchedForFiles.length === 0 && (
            <h1 className="w-3/4 bg-gray-800 mx-auto mt-4 font-semibold text-xl text-[#4294FF]">
              Ooops! We couldn’t find anything for
              <span className="text-white ml-1">"{searchText}"</span> in
              <span className="text-white ml-1">
                "{collapseBreadcrumbPath(getBreadcrumbPath(directory))}"
              </span>
            </h1>
          )}
        </div>
      </main>
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
