import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserDataContext } from "../contexts/UserContext";
import { useEffect } from "react";
import axios from "axios";

const AuthenticatedUserOnlyWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/auth/signin");
    }
  }, [token]);

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        setUser(response.data.user);
      }
    })
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/auth/signin");
    })
    .finally(() => {
      setIsLoading(false);
    });

  if (isLoading) return <div>Verifying You...</div>;
  return <>{children}</>;
};

export default AuthenticatedUserOnlyWrapper;
