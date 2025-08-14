import { CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { delay } from "../utils/delay";
import { isvalidEmail } from "../utils/validateEmail";
import axios from "axios";
import ToastError from "./Toast/ToastError";
import ToastAuthenticated from "./Toast/ToastAuthenticated";

const UserAccount = () => {
  let { username } = useParams();
  const { user } = useUser();
  const [email, setEmail] = useState(user.email);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const inputRef = useRef(null);
  const spanRef = useRef(null);

  // Submit Form handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await delay(1000); // Wait for 1 second

      if (!isvalidEmail(email)) {
        console.log("wrong format of email");
        toast.open(
          <ToastError
            headline="Can't update email"
            subHeadline="Invalid email format"
          />
        );
        setEmail(user.email);
        return;
      }

      const userData = { email };

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/email`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.open(
          <ToastAuthenticated
            headline="Email updated"
            subHeadline="We've updated your email"
          />
        );
      } else {
        setEmail(user.email);
        console.log("");
      }
    } catch (error) {
      const errSubHeadlineMsg = error.response.data.message;
      const errHeadlineMsg = "Can't change email";
      toast.open(
        <ToastError headline={errHeadlineMsg} subHeadline={errSubHeadlineMsg} />
      );
      setEmail(user.email);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // To focus in input as soon as editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // Focus input when edit mode begins
    }
  }, [isEditing]);

  // To adjust size of input based on content
  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 4}px`; // extra padding
    }
  }, [email, isEditing]);

  return (
    <main className="p-8">
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
      <header className="w-5/6 mx-auto mb-5">
        <main className="bg-gray-900 rounded-xl p-10">
          <h1 className="text-white text-xl flex items-center gap-4">
            <span className="h-10 w-10 border-2 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </span>
            {user.name}
          </h1>
          <div className="border-1 border-gray-800 mt-5"></div>
          <h1 className="text-white text-xl flex items-center gap-5 mt-5 p-2">
            <span>
              {user.isEmailVerified ? (
                <i className="ri-mail-check-line text-[20px]"></i>
              ) : (
                <i className="ri-mail-unread-line text-[25px]"></i>
              )}
            </span>
            <form
              onSubmit={handleFormSubmit}
              className="flex gap-2 items-center relative"
            >
              <span
                ref={spanRef}
                className="absolute opacity-0 pointer-events-none whitespace-pre text-[18px]"
              >
                {email || " "}
              </span>
              <input
                ref={inputRef}
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className={`${
                  isEditing
                    ? "border-b border-blue-500 focus:outline-none"
                    : "bg-transparent"
                } text-gray-300 text-[18px]`}
              />
              {!user.isEmailVerified && (
                <>
                  {!isEditing ? (
                    <span
                      onClick={() => setIsEditing(true)}
                      className={`px-[4px] rounded-full cursor-pointer hover:text-[#376CFB] ${
                        isEditing && "text-[#376CFB]"
                      }`}
                    >
                      <i className="ri-pencil-line"></i>
                    </span>
                  ) : (
                    <>
                      {!loading ? (
                        <button
                          type="submit"
                          className={`flex px-[4px] rounded-full cursor-pointer hover:text-[#376CFB] ${
                            isEditing && "text-[#376CFB]"
                          } border-2 hover:bg-[#376CFB] hover:text-white`}
                        >
                          <i className="ri-check-line"></i>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={`flex rounded-full ${
                            isEditing && "text-[#376CFB]"
                          }`}
                        >
                          <CircularProgress size="25px" />
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
              {!user.isEmailVerified && (
                <Link to={`/auth/verify-email`} end>
                  <button className="bg-[#4294FF] cursor-pointer hover:bg-white hover:text-[#4294FF] border-2 border-white text-white text-[15px] rounded-2xl pl-4 pr-2 font-semibold">
                    Verify
                    <span>
                      <i className="ri-arrow-right-s-line"></i>
                    </span>
                  </button>
                </Link>
              )}
            </form>
          </h1>
        </main>
      </header>
    </main>
  );
};

export default UserAccount;
