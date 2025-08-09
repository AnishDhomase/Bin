import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SignupSigninOutline from "../components/SignupSigninOutline";
import { textFieldSx } from "../utils/MUICustomStyles";
import { Link } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  async function handleFormSubmit(formData) {
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
  }

  return (
    <SignupSigninOutline headline={"Welcome Back"}>
      <form action={handleFormSubmit} className="flex flex-col gap-4">
        <TextField
          name="email"
          required
          id="standard-basic"
          label="Email"
          variant="outlined"
          placeholder="example@example.com"
          sx={textFieldSx}
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
          Login
        </Button>
      </form>
      <footer className="px-5 text-white flex justify-center gap-1 mt-1">
        Don't have an account?
        <Link to="/auth/signup">
          <button className="text-[#4294FF] cursor-pointer font-medium">
            Signup
          </button>
        </Link>
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
          <span className="text-[16px] font-semibold">Sign in with Google</span>
        </button>
      </div> */}
    </SignupSigninOutline>
  );
};

export default Signin;
