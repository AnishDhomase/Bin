import { Link, Outlet, useParams } from "react-router";
import FilesFoldersContext from "../contexts/FilesFoldersContext";
import { lazy } from "react";
import { StyledNavLink } from "../components/DashboardNav";
import { Button } from "@mui/material";
import DashboardBanner from "../components/DashboardBanner";
const DashboardNav = lazy(() => import("../components/DashboardNav"));

const Dashboard = () => {
  return (
    <FilesFoldersContext>
      <div className="flex">
        <DashboardNav />
        <div className="bg-[#1c2331] w-4/5">
          <DashboardBanner />
          <Outlet />
        </div>
      </div>
    </FilesFoldersContext>
  );
};

export default Dashboard;
