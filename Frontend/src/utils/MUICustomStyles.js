export const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: "18px",
    color: "#ffffff",
    "& fieldset": {
      borderColor: "#ffffff",
    },
    "&:hover fieldset": {
      borderColor: "#4294FF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4294FF",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "20px",
    color: "#4294FF",
    top: "50%",
    transform: "translate(14px, -50%)",
    transition: "all 0.2s ease",
    backgroundColor: "#202020", // match your input background to avoid overlap
    padding: "0 4px", // Add padding so it doesn't touch border
  },
  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
    {
      transform: "translate(14px, -9px) scale(0.75)", // Floating position
      padding: "0 4px",
    },
  "& .MuiOutlinedInput-input": {
    padding: "12px 18px", // default padding for better alignment
  },
  "& .MuiInputLabel-shrink": {
    top: "0",
    transform: "translate(14px, -9px) scale(0.75)",
  },
};
