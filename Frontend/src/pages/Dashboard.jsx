import DashboardNav from "../components/DashboardNav";
import DashboardMain from "../components/DashboardMain";
import { Outlet } from "react-router";
import FilesFoldersContext from "../contexts/FilesFoldersContext";

const Dashboard = () => {
  return (
    <FilesFoldersContext>
      <div className="flex justify-center" style={{}}>
        <DashboardNav />
        <Outlet />
      </div>
    </FilesFoldersContext>
  );
};

export default Dashboard;
