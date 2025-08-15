import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router";
import { delay } from "../utils/delay";
import axios from "axios";
import ToastError from "./Toast/ToastError";
import ToastAuthenticated from "./Toast/ToastAuthenticated";

const LogoutModalContent = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await delay(1000); // Wait for 1 second

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.success === true) {
        navigate("/");
        await delay(2000); // Wait for 2 second
        toast.open(
          <ToastAuthenticated
            headline="Log Out Success"
            subHeadline="You have successfully logged out"
          />
        );
      } else {
        console.log("");
      }
    } catch (error) {
      console.log(error.response.data);
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Log out failed";

      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-5 mt-7">
      <Button
        variant="contained"
        fullWidth
        disableElevation
        onClick={() => closeModal()}
        sx={{
          textTransform: "capitalize",
          fontSize: "18px",
          color: "white",
          padding: "8px 15px",
          fontWeight: "500",
          height: "100%",
          backgroundColor: "gray",
        }}
      >
        Cancel
      </Button>
      <Button
        fullWidth
        disabled={loading}
        disableElevation
        variant="contained"
        onClick={handleLogout}
        sx={{
          textTransform: "capitalize",
          fontSize: "18px",
          color: "white",
          fontWeight: "500",
          padding: "8px 15px",
          height: "100%",
        }}
      >
        {!loading ? (
          "Log Out"
        ) : (
          <CircularProgress
            size="32px"
            sx={{
              color: "white",
            }}
          />
        )}
      </Button>
    </div>
  );
};

export default LogoutModalContent;
