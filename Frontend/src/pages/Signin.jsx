import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SignupSigninOutline from "../components/SignupSigninOutline";

const Signin = () => {
  async function handleFormSubmit(formData) {
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(userData);
  }
  return (
    <SignupSigninOutline headline={"Sign In"}>
      <form
        action={handleFormSubmit}
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <TextField
          name="email"
          required
          id="standard-basic"
          label="Email"
          variant="standard"
          placeholder="example@example.com"
          sx={{
            input: {
              fontSize: "22px",
              color: "#333",
            },
            label: {
              fontSize: "20px",
            },
          }}
        />
        <TextField
          name="password"
          required
          id="standard-basic"
          label="Password"
          variant="standard"
          // type="password"
          placeholder="At least of length 6"
          sx={{
            input: {
              fontSize: "22px",
              color: "#333",
            },
            label: {
              fontSize: "20px",
            },
          }}
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
            backgroundColor: "#1976D2",
            padding: "8px 20px",
            "&:hover": {
              backgroundColor: "#0869d0",
            },
          }}
        >
          Sign In
        </Button>
      </form>
    </SignupSigninOutline>
  );
};

export default Signin;
