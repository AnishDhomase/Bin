import { Outlet } from "react-router";
import FilesFoldersContext from "../contexts/FilesFoldersContext";
import { lazy } from "react";
const DashboardNav = lazy(() => import("../components/DashboardNav"));

const Dashboard = () => {
  return (
    <FilesFoldersContext>
      <div className="flex">
        <DashboardNav />
        <Outlet />
      </div>
    </FilesFoldersContext>
  );
};

export default Dashboard;
