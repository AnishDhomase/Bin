import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <UserDataContext.Provider
      value={{ user, setUser, isLoading, setIsLoading }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserContextProvider boundry");
  }
  return context;
};

export default UserContext;
