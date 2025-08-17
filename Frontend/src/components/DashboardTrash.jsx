import { IconButton, LinearProgress, Modal } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { delay } from "../utils/delay";
import axios from "axios";
import { useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import { useState } from "react";
import ToastError from "./Toast/ToastError";
import Search from "./Search";
import FileFolder from "./FileFolder";

const DashboardTrash = () => {
  let { username } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);
  const toast = useToast();
  const [fileOpen, setFileOpen] = useState(null);
  const isPDFFileOpen = fileOpen?.cloudinaryAssetId?.format === "pdf";

  // Load content in current directory
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 200));
      await delay(200);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/asset/trash`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success === true) {
        const fetchedItems = response.data.data;
        setFiles(() => fetchedItems);
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
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  async function handleFileTrash(fileFolderToToggle) {
    setFiles((files) =>
      files.filter((item) => item._id !== fileFolderToToggle._id)
    );
  }

  return (
    <main className="p-8 h-screen">
      {/* Back button and Page title */}

      <header className="w-5/6 mx-auto flex gap-4 mb-8 items-center justify-start">
        {/* Back button */}
        <NavLink to={`/dashboard/${username}`}>
          <IconButton
            aria-label="delete"
            sx={{
              padding: 0,
              color: "white",
              position: "relative",
              "&:hover": {
                fontWeight: "900",
                left: "-5px",
                color: "#4294FF",
                backgroundColor: "transparent", // or any subtle hover background
              },
            }}
          >
            <i className="ri-arrow-left-long-line text-inherit"></i>
          </IconButton>
        </NavLink>

        {/* Title of page */}
        <h1 className="text-white text-2xl font-semibold">Trash</h1>
      </header>

      <header className=" w-5/6 mx-auto mb-5">
        <main className="min-h-[450px] bg-gray-800 rounded-xl p-5">
          {/* Search bar */}
          <section className="flex justify-between content-center gap-2 w-3/4 mx-auto items-center">
            <Search
              files={files}
              setSearchedForFiles={setSearchedForFiles}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </section>

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

          {/* If no searchText don't allow drag and drop */}
          {searchText.length === 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              {files.map((file) => (
                <FileFolder
                  key={file.id}
                  file={file}
                  handleFileTrash={handleFileTrash}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  isTrashPage={true}
                  setFileOpen={setFileOpen}
                />
              ))}
            </ul>
          )}

          {/* If no searchText and no files/folders in current directory*/}
          {!loading && searchText.length === 0 && files.length === 0 && (
            <h1 className="w-3/4 p-4 rounded-xl bg-[#0000006b]  mx-auto mt-4 font-semibold text-md text-[#4294FF] text-center">
              You haven't starred any files yet. Tap the
              <span className="text-white ml-1">"star"</span> icon to add.
            </h1>
          )}

          {/* If searchText present 1. don't allow drag and drop 2. heighlight results with query text*/}
          {searchText.length !== 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              {searchedForFiles.map((file) => (
                <FileFolder
                  key={file.id}
                  file={file}
                  handleFileTrash={handleFileTrash}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  isTrashPage={true}
                  setFileOpen={setFileOpen}
                />
              ))}
            </ul>
          )}

          {/* If searchText present but no results found */}
          {searchText.length !== 0 && searchedForFiles.length === 0 && (
            <h1 className="w-3/4 p-4 rounded-xl bg-[#0000006b]  mx-auto mt-4 font-semibold text-md text-[#4294FF] text-center">
              Ooops! We couldn’t find anything for
              <span className="text-white ml-1">"{searchText}"</span>
            </h1>
          )}

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
      </header>
    </main>
  );
};

export default DashboardTrash;
