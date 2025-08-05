import { useEffect, useRef, useState } from "react";
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
  },
  {
    id: "9",
    name: "mountains.jpg",
    ext: "jpg",
    parentId: "7",
    isFolder: false,
    isStarred: false,
    isTrash: false,
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
  },
  {
    id: "12",
    name: "todo.txt",
    ext: "txt",
    parentId: "1",
    isFolder: false,
    isStarred: false,
    isTrash: false,
  },
];

const fileType = ["Image", "Document", "Other", "Video"];
const extType = [
  { ext: "jpg", type: "Image", size: "1.25 GB" },
  { ext: "png", type: "Image", size: "1.2 GB" },
  { ext: "pdf", type: "Document", size: "1.5 GB" },
  { ext: "txt", type: "Other", size: "45 MB" },
  { ext: "mp4", type: "Video", size: "45 MB" },
];

const DashboardMain = () => {
  const [directory, setDirectory] = useState([]);
  const [allDBFiles, setAllDBFiles] = useState(filesData);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles(() =>
        allDBFiles.filter(
          (file) =>
            file.parentId ==
            (directory.length === 0 ? null : directory.at(-1)?.id)
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

  function toggleStar(fileFolder) {
    setAllDBFiles((allDBFiles) =>
      allDBFiles.map((item) =>
        item.id !== fileFolder.id
          ? item
          : { ...item, isStarred: !item.isStarred }
      )
    );
  }

  function toggleTrash(fileFolder) {
    setAllDBFiles((allDBFiles) =>
      allDBFiles.map((item) =>
        item.id !== fileFolder.id ? item : { ...item, isTrash: !item.isTrash }
      )
    );
  }

  return (
    <main className="bg-[#1c2331] w-4/5 p-8">
      <header className=" w-5/6 mx-auto mb-5">
        <main className="h-[250px] bg-gray-900 rounded-xl p-5">
          <h1 className="text-white text-xl">
            Storage overview will be implemented here soon ...
          </h1>
        </main>
      </header>
      <main className="w-5/6 mx-auto bg-gray-800 py-10 rounded-xl">
        <div className="flex flex-col">
          <section className="flex justify-between content-center gap-2 w-3/4 mx-auto">
            <Search
              files={files}
              setSearchedForFiles={setSearchedForFiles}
              searchText={searchText}
              setSearchText={setSearchText}
            />
            <span className="flex gap-1.5">
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

          {loading && (
            <div className="w-3/4 mx-auto mt-4">
              <LinearProgress />
            </div>
          )}

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
        </div>
      </main>
    </main>
  );
};

export default DashboardMain;
