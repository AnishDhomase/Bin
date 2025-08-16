import { Button, IconButton, LinearProgress } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import Search from "./Search";
import { FilesFoldersDataContext } from "../contexts/FilesFoldersContext";
import FileFolder from "./FileFolder";
import { DndContext } from "@dnd-kit/core";
import { getParentIdFromDirectory } from "./DashboardMain";
import { delay } from "../utils/delay";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";
import ToastError from "./Toast/ToastError";

const DashboardFav = () => {
  let { username } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);
  const toast = useToast();

  // Load content in current directory
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 200));
      await delay(200);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/asset/star`,
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

  async function handleFileStar(fileFolderToToggle) {
    setFiles((files) =>
      files.filter((item) => item._id !== fileFolderToToggle._id)
    );
  }

  async function handleFileTrash(fileFolderToToggle) {
    setFiles((files) =>
      files.filter((item) => item._id !== fileFolderToToggle._id)
    );
  }

  // async function handleFileTrash(fileFolderToTrash) {
  //   setFiles((files) =>
  //     files.filter((item) => item._id !== fileFolderToTrash._id)
  //   );
  // }

  return (
    <main className="p-8">
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
        <h1 className="text-white text-2xl font-semibold">Favourites</h1>
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
                  handleFileStar={handleFileStar}
                  handleFileTrash={handleFileTrash}
                  searchText={searchText}
                  setSearchText={setSearchText}
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
                  handleFileStar={handleFileStar}
                  handleFileTrash={handleFileTrash}
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
              <span className="text-white ml-1">"{searchText}"</span>
            </h1>
          )}
        </main>
      </header>
    </main>
  );
};

export default DashboardFav;
