import { createBrowserRouter, RouterProvider } from "react-router";
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  { path: "/", Component: Start },
  { path: "/dashboard", Component: Dashboard },
  {
    path: "/auth",
    children: [
      { path: "signup", Component: Signup },
      { path: "signin", Component: Signin },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
