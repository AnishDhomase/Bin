import React from "react";
import SignupSigninOutline from "../components/SignupSigninOutline";
import { Button, TextField } from "@mui/material";
import { textFieldSx } from "../utils/MUICustomStyles";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserDataContext } from "../contexts/UserContext";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  console.log("User from context:", user);
  console.log("User from localStorage:", localStorage.getItem("user"));
  async function handleFormSubmit() {}
  return (
    <div>
      <SignupSigninOutline headline={"Verify email"}>
        <div className="text-md text-gray-300 font-extralight text-center">
          We've sent OTP to
        </div>
        <div className="text-white text-md font-extralight text-center -mt-1 mb-8">
          {user?.email}
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <TextField
            name="otp"
            required
            id="standard-basic"
            label="OTP"
            variant="outlined"
            placeholder="6 Digit OTP"
            autoComplete="off"
            sx={textFieldSx}
          />

          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              textTransform: "capitalize",
              fontSize: "18px",
              fontWeight: "500",
              color: "#ffffff",
              backgroundColor: "#4294FF",
              padding: "5px 10px",
              "&:hover": {
                backgroundColor: "#376CFB",
              },
            }}
          >
            Verify
          </Button>
        </form>

        <footer className="px-5 text-white flex justify-center gap-1 mt-5">
          Didn't receive an email?
          <button className="text-[#4294FF] cursor-pointer font-medium">
            Resend
          </button>
        </footer>
      </SignupSigninOutline>
    </div>
  );
};

export default VerifyEmail;
