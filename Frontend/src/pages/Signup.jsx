import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SignupSigninOutline from "../components/SignupSigninOutline";
import { textFieldSx } from "../utils/MUICustomStyles";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { lazy, useState } from "react";
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { UserDataContext, useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import ToastAuthenticated from "../components/Toast/ToastAuthenticated";
import ToastEmailVerified from "../components/Toast/ToastEmailVerified";
import ToastError from "../components/Toast/ToastError";
import { isvalidEmail } from "../utils/validateEmail";
import ToastOTPSent from "../components/Toast/ToastOTPSent";
import { delay } from "../utils/delay";

const headline = "Create account";

const Signup = () => {
  // Controlled form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();
  const toast = useToast();

  // Show and hide password MUI
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // Submit Form handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await delay(1000); // Wait for 1 second

      if (name?.length < 2) {
        toast.open(
          <ToastError
            headline="Name Too Small"
            subHeadline="Name should be at least of length 2"
          />
        );
        return;
      }
      if (!isvalidEmail(email)) {
        toast.open(
          <ToastError
            headline="Invalid Email"
            subHeadline="Incorrect Email format"
          />
        );
        return;
      }
      if (password?.length < 6) {
        toast.open(
          <ToastError
            headline="Password Too Small"
            subHeadline="Password should be at least of length 6"
          />
        );
        return;
      }
      const userData = { name, email, password };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        userData
      );

      console.log(response.data);
      if (response.data.success === true) {
        toast.open(<ToastAuthenticated />);
        const { token } = response.data.data;
        localStorage.setItem("token", token);

        await delay(2000); // Wait for 1 second
        navigate("/auth/verify-email");

        await delay(2000); // Wait for 1 second
        toast.open(<ToastOTPSent />);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error.response.data);
      const errCode = error.response.data.errorCode;
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg =
        errCode === "VALIDATION_ERROR"
          ? "Validation Error"
          : "User already exists";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SignupSigninOutline headline={headline}>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <TextField
          name="name"
          required
          id="standard-basic"
          label="Name"
          variant="outlined"
          placeholder="Anish Dhomase"
          autoComplete="off"
          sx={textFieldSx}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="email"
          required
          id="standard-basic"
          label="Email"
          variant="outlined"
          autoComplete="off"
          placeholder="example@example.com"
          sx={textFieldSx}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          required
          id="standard-basic"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          placeholder="At least of length 6"
          sx={textFieldSx}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#ffffff" }} />
                  ) : (
                    <Visibility sx={{ color: "#ffffff" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          disabled={loading}
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
            "&.Mui-disabled": {
              backgroundColor: "rgba(66, 148, 255, 0.5)", // 50% transparent
              color: "rgba(255, 255, 255, 0.7)", // lighter text
            },
          }}
        >
          {!loading ? (
            "Register"
          ) : (
            <div className="flex content-center">
              <CircularProgress size="31px" color="inherit" />
            </div>
          )}
        </Button>
      </form>

      <footer className="px-5 text-white flex justify-center gap-1 mt-1">
        Already have an account?
        <button
          disabled={loading}
          className={`text-[#4294FF] font-medium ${
            !loading ? "cursor-pointer" : ""
          }`}
        >
          {!loading ? <Link to="/auth/signin">Signin</Link> : "Signin"}
        </button>
      </footer>

      {/* Google signin */}
      {/* <div className="text-white flex flex-col items-center rounded-md mx-auto">
        <div className="flex items-center w-full gap-4 text-gray-300 text-sm my-5 ">
          <div className="flex-grow border-t border-gray-400" />
          <span>or</span>
          <div className="flex-grow border-t border-gray-400" />
        </div>

        <button
          onClick={() => login()}
          className="w-full flex justify-center items-center gap-3 cursor-pointer bg-white text-black px-[5px] py-[10px] rounded-md hover:bg-gray-200 transition duration-200"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
            alt="Google"
            className="h-5"
          />
          <span className="text-[16px] font-semibold">Sign up with Google</span>
        </button>
      </div> */}
    </SignupSigninOutline>
  );
};

export default Signup;
