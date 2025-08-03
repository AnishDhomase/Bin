import DashboardNav from "../components/DashboardNav";
import DashboardMain from "../components/DashboardMain";

const Dashboard = () => {
  return (
    <div className="flex justify-center" style={{}}>
      <DashboardNav />
      <DashboardMain />
    </div>
  );
};

export default Dashboard;
