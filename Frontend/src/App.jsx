import { createBrowserRouter, RouterProvider } from "react-router";
import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import DashboardMain from "./components/DashboardMain";
import DashboardFav from "./components/DashboardFav";
import DashboardTrash from "./components/DashboardTrash";

const router = createBrowserRouter([
  { path: "/", Component: Start },
  {
    path: "/dashboard/:username",
    Component: Dashboard,
    children: [
      { index: true, Component: DashboardMain },
      { path: "favourites", Component: DashboardFav },
      { path: "trash", Component: DashboardTrash },
    ],
  },
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
