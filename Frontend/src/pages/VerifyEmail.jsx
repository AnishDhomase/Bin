import React from "react";
import SignupSigninOutline from "../components/SignupSigninOutline";
import { Button, TextField } from "@mui/material";
import { textFieldSx } from "../utils/MUICustomStyles";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserDataContext } from "../contexts/UserContext";
import axios from "axios";
import { useState } from "react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState("");

  const handleOtpChange = (e) => {
    if (e.target.value.length > 6) return;
    setOtp(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000); // Wait for 1 second

    try {
      const userData = { token: otp };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/email/verify`,
        userData,
        {
          withCredentials: true, // enable sending cookies
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/dashboard/${user.name}`);
        return;
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); // Wait for 1 second
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/email/verification-token`,
        {},
        {
          withCredentials: true, // enable sending cookies
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("successfully resent otp!");
      } else {
        alert("problem in resending otp!");
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SignupSigninOutline headline={"Verify email"}>
        <div className="text-md text-gray-300 font-extralight text-center">
          We've sent OTP to
        </div>
        <div className="text-white text-md font-extralight text-center -mt-1 mb-8">
          {user.email}
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <TextField
            value={otp}
            onChange={handleOtpChange}
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
            disabled={isLoading || isResending}
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
              "&.Mui-disabled": {
                color: "#b9b2b2",
                backgroundColor: "#4294ff6b",
                cursor: "not-allowed",
              },
            }}
          >
            {isLoading ? "Verifying ..." : "Verify"}
          </Button>
        </form>

        <footer className="px-5 text-white flex justify-center gap-1 mt-5">
          Didn't receive an email?
          <button
            // className="text-[#4294FF] cursor-pointer font-medium"
            className={`text-[#4294FF] font-medium ${
              isLoading || isResending
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={handleResendOtp}
            disabled={isLoading || isResending}
          >
            {isResending ? "Resending ..." : "Resend"}
          </button>
        </footer>
      </SignupSigninOutline>
      <Link to={`/dashboard/${user.name}`}>
        <Button
          disabled={isLoading || isResending}
          variant="text"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,

            border: "1px solid #ffffff3d",
            color: "#376CFB",
            fontWeight: "500",
            fontSize: "16px",
            textTransform: "none",
            zIndex: 1000,
            "&:hover": {
              backgroundColor: "rgba(66, 148, 255, 0.1)",
              border: "1px solid #4294FF",
            },
            "&.Mui-disabled": {
              color: "#376bfb6b",
              cursor: "not-allowed",
            },
          }}
        >
          Skip
        </Button>
      </Link>
    </>
  );
};

export default VerifyEmail;
