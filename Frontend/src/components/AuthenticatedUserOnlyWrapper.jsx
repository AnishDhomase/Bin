import { useState } from "react";
import { useNavigate } from "react-router";
import { UserDataContext, useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import axios from "axios";

const AuthenticatedUserOnlyWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user !== null && user !== undefined) return;
    if (!token) {
      navigate("/auth/signin");
      return;
    }
    console.log("checking", user);
    const fetchProfile = async () => {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("try", response);
            setUser(response.data);
          }
        })
        .catch((err) => {
          console.log("catch", err);
          localStorage.removeItem("token");
          navigate("/auth/signin");
        })
        .finally(() => {
          console.log("finally");
          setIsLoading(false);
        });
    };

    fetchProfile();
  }, [token, user, navigate, setUser]);

  if (isLoading)
    return <div className="text-white text-3xl">Verifying You...</div>;
  return <>{children}</>;
};

export default AuthenticatedUserOnlyWrapper;
