import { IconButton } from "@mui/material";
import React from "react";
import { NavLink, useParams } from "react-router";

const UserAccount = () => {
  let { username } = useParams();
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
        <h1 className="text-white text-2xl font-semibold">Account</h1>
      </header>
    </main>
  );
};

export default UserAccount;
