import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserContext from "./contexts/UserContext.jsx";
import ToastContext from "./contexts/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <UserContext>
      <ToastContext>
        <App />
      </ToastContext>
    </UserContext>
  </GoogleOAuthProvider>
);
