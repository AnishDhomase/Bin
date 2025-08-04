import DashboardNav from "../components/DashboardNav";
import DashboardMain from "../components/DashboardMain";
import { Outlet, useParams } from "react-router";

const Dashboard = () => {
  let { username } = useParams();
  return (
    <div className="flex justify-center" style={{}}>
      <DashboardNav />
      <Outlet />
      {/* <DashboardMain /> */}
    </div>
  );
};

export default Dashboard;
