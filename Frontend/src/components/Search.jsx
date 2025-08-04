import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import TuneIcon from "@mui/icons-material/Tune";

export default function Search() {
  return (
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
        sx={{ ml: 1, flex: 1, fontSize: "18px", color: "white" }}
        placeholder="Search here"
        inputProps={{ "aria-label": "search here" }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px", color: "white" }}
        aria-label="search"
      >
        <TuneIcon />
      </IconButton>
    </Paper>
  );
}
