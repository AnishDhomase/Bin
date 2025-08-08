import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Loading from "./Animations/Loading";
import AuthenticatedUserOnlyWrapper from "./components/AuthenticatedUserOnlyWrapper";
const Start = lazy(() => import("./pages/Start"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardMain = lazy(() => import("./components/DashboardMain"));
const DashboardFav = lazy(() => import("./components/DashboardFav"));
const DashboardTrash = lazy(() => import("./components/DashboardTrash"));
const UserAccount = lazy(() => import("./components/UserAccount"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));

const router = createBrowserRouter([
  { path: "/", Component: Start },
  {
    path: "/dashboard/:username",
    element: (
      // <AuthenticatedUserOnlyWrapper>
      <Dashboard />
      // </AuthenticatedUserOnlyWrapper>
    ),
    children: [
      { index: true, Component: DashboardMain },
      { path: "favourites", Component: DashboardFav },
      { path: "trash", Component: DashboardTrash },
      { path: "account", Component: UserAccount },
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
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
