import { createBrowserRouter, RouterProvider } from "react-router";
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

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
