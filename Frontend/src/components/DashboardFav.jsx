import { Button, IconButton, LinearProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import Search from "./Search";
import { FilesFoldersDataContext } from "../contexts/FilesFoldersContext";
import FileFolder from "./FileFolder";
import { DndContext } from "@dnd-kit/core";

const DashboardFav = () => {
  const { allDBFiles, toggleStar, toggleTrash } = useContext(
    FilesFoldersDataContext
  );
  let { username } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedForFiles, setSearchedForFiles] = useState([]);

  // Load favs
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles(() =>
        allDBFiles.filter((item) => item.isStarred && !item.isTrash)
      );
      setLoading(false);
    };

    fetchFiles();
  }, [allDBFiles]);

  return (
    <main className="bg-[#1c2331] w-4/5 p-8 text-white">
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

          {/* If no searchText don't allow drag and drop */}
          {searchText.length === 0 && (
            <ul className="flex flex-col gap-2 w-3/4 bg-gray-800 mx-auto mt-4">
              {files.map((file) => (
                <FileFolder
                  key={file.id}
                  file={file}
                  // setDirectory={setDirectory}
                  toggleStar={toggleStar}
                  toggleTrash={toggleTrash}
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              ))}
            </ul>
          )}

          {/* If no searchText and no files/folders in current directory*/}
          {!loading && searchText.length === 0 && files.length === 0 && (
            <h1 className="w-3/4 bg-gray-800 mx-auto mt-4 font-semibold text-xl text-[#4294FF]">
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
                  // setDirectory={setDirectory}
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
              <span className="text-white ml-1">"{searchText}"</span>
            </h1>
          )}
        </main>
      </header>
    </main>
  );
};

export default DashboardFav;
