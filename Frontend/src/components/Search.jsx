import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useEffect, useState } from "react";
import MyModal from "./MyModal";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const checkBoxStyle = {
  color: "white",
  "&.Mui-checked": { color: "#376CFB" },
  marginLeft: "30px",
};
const FormLabelStyle = {
  margin: "-5px 0",
  ".MuiFormControlLabel-label": {
    // style the label text
    fontSize: "16px",
    color: "white",
    fontWeight: 500,
  },
  "&:hover .MuiCheckbox-root": {
    color: "#376CFB", // hover color on checkbox
  },
};

export default function Search({
  files,
  setSearchedForFiles,
  searchText,
  setSearchText,
}) {
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  const [filter, setFilter] = useState({
    includeFiles: true,
    includeFolders: true,
    includeImages: true,
    includeDocuments: true,
  });

  useEffect(() => {
    const lowerCaseToSearchFor = searchText.toLowerCase().trim();
    setSearchedForFiles(
      files.filter((item) => {
        if (!filter.includeFiles && !item.isFolder) return;
        if (!filter.includeFolders && item.isFolder) return;
        if (!item.isFolder) {
          if (!filter.includeDocuments && item.type === "document") return;
          if (!filter.includeImages && item.type === "image") return;
        }
        const lowerCaseItemName = item.name.toLowerCase();
        return lowerCaseItemName.includes(lowerCaseToSearchFor);
      })
    );
  }, [files, searchText, setSearchedForFiles, filter]);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    if (name === "includeFiles" && checked === false) {
      if (filter.includeFolders === false)
        setFilter((prev) => ({ ...prev, ["includeFolders"]: true }));
    } else if (name === "includeFolders" && checked === false) {
      if (filter.includeFiles === false)
        setFilter((prev) => ({ ...prev, ["includeFiles"]: true }));
    } else if (name === "includeImages" && checked === false) {
      if (filter.includeDocuments === false)
        setFilter((prev) => ({ ...prev, ["includeDocuments"]: true }));
    } else {
      if (filter.includeImages === false)
        setFilter((prev) => ({ ...prev, ["includeImages"]: true }));
    }
    setFilter((prev) => ({ ...prev, [name]: checked }));
  };
  return (
    <form>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400,
          backgroundColor: "#101828",
        }}
      >
        <IconButton sx={{ p: "10px", color: "white" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase
          autoFocus
          value={searchText}
          onChange={handleChange}
          sx={{ ml: 1, flex: 1, fontSize: "18px", color: "white" }}
          placeholder="Search here"
          inputProps={{ "aria-label": "search here" }}
        />
        <MyModal
          btn={
            <IconButton
              type="button"
              sx={{ p: "10px", color: "white" }}
              aria-label="search"
            >
              <TuneIcon />
            </IconButton>
          }
        >
          <h1 className="mb-10 text-[#376CFB] font-semibold text-4xl text-center mt-1">
            Filters
          </h1>
          <div className="text-white flex flex-col gap-4 justify-center items-center">
            <FormGroup
              sx={{
                minWidth: "200px",
              }}
            >
              <h1 className="text-gray-400 text-xl flex items-center gap-1">
                <TuneIcon
                  sx={{
                    fontSize: "26px",
                    color: "#100e24",
                  }}
                />
                Select item type
              </h1>
              <FormControlLabel
                control={
                  <Checkbox
                    name="includeFiles"
                    checked={filter["includeFiles"]}
                    onChange={handleFilterChange}
                    sx={checkBoxStyle}
                  />
                }
                label="Files"
                sx={FormLabelStyle}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="includeFolders"
                    checked={filter["includeFolders"]}
                    onChange={handleFilterChange}
                    sx={checkBoxStyle}
                  />
                }
                label="Folders"
                sx={FormLabelStyle}
              />
            </FormGroup>
            <FormGroup
              sx={{
                minWidth: "200px",
              }}
            >
              <h1 className="text-gray-400 text-xl flex items-center gap-1">
                <TuneIcon
                  sx={{
                    fontSize: "26px",
                    color: "#100e24",
                  }}
                />
                Select file type
              </h1>
              <div className="flex flex-col">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeImages"
                      checked={filter["includeImages"]}
                      onChange={handleFilterChange}
                      sx={checkBoxStyle}
                    />
                  }
                  label="Images"
                  sx={FormLabelStyle}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeDocuments"
                      checked={filter["includeDocuments"]}
                      onChange={handleFilterChange}
                      sx={checkBoxStyle}
                    />
                  }
                  label="Documents"
                  sx={FormLabelStyle}
                />
              </div>
            </FormGroup>
          </div>
        </MyModal>
      </Paper>
    </form>
  );
}
