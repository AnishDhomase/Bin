import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SignupSigninOutline from "../components/SignupSigninOutline";
import { textFieldSx } from "../utils/MUICustomStyles";
import { Link } from "react-router";

const Signin = () => {
  async function handleFormSubmit(formData) {
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(userData);
  }
  return (
    <SignupSigninOutline headline={"Welcome Back"}>
      <form
        action={handleFormSubmit}
        className="p-5 flex flex-col gap-7"
        // style={{
        //   padding: "20px",
        //   display: "flex",
        //   flexDirection: "column",
        //   gap: "30px",
        // }}
      >
        <TextField
          name="email"
          required
          id="standard-basic"
          label="Email"
          variant="standard"
          placeholder="example@example.com"
          sx={textFieldSx}
        />
        <TextField
          name="password"
          required
          id="standard-basic"
          label="Password"
          variant="standard"
          // type="password"
          placeholder="At least of length 6"
          sx={textFieldSx}
        />
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: "500",
            color: "#ffffff",
            backgroundColor: "#4294FF",
            padding: "8px 20px",
            "&:hover": {
              backgroundColor: "#376CFB",
            },
          }}
        >
          Login
        </Button>
      </form>
      <footer
        className="px-5 text-white flex justify-center gap-1 -mt-2"
        // style={{
        //   padding: "0 20px",
        //   color: "white",
        //   display: "flex",
        //   justifyContent: "center",
        //   gap: "5px",
        //   marginTop: "-10px",
        // }}
      >
        Don't have an account?
        <Link to="/auth/signup">
          <button
            // style={{
            //   color: "#4294FF",
            //   cursor: "pointer",
            //   fontWeight: "500",
            // }}
            className="text-[#4294FF] cursor-pointer font-medium"
          >
            Signup
          </button>
        </Link>
      </footer>
    </SignupSigninOutline>
  );
};

export default Signin;
