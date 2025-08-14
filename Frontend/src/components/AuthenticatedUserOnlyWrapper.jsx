import { useState } from "react";
import { useNavigate } from "react-router";
import { UserDataContext, useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import axios from "axios";
import Loading from "../Animations/Loading";

const AuthenticatedUserOnlyWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading } = useUser();
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user !== null && user !== undefined) return;
    if (!token) {
      navigate("/auth/signin");
      return;
    }

    const fetchProfile = async () => {
      // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // await delay(5000); // Wait for 5 second

      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.data);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/auth/signin");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchProfile();
  }, [token, user, navigate, setUser, isLoading, setIsLoading]);

  if (isLoading) {
    return <Loading />;
  }
  return <>{children}</>;
};

export default AuthenticatedUserOnlyWrapper;
