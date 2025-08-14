import React from "react";
import { Link } from "react-router";
import { useUser } from "../contexts/UserContext";

const DashboardBanner = () => {
  const { user } = useUser();
  if (user.isEmailVerified) return null;
  return (
    <div className="sticky top-0 bg-[#87bafe] py-4 px-26 text-[18px] z-1000 flex items-center gap-4">
      Verify your email to unlock full functionality
      <Link to={`/auth/verify-email`} end>
        <button className="cursor-pointer hover:bg-white hover:text-[#97c4ff] border-2 border-white text-white font-semibold rounded-2xl pl-4 pr-2">
          Verify
          <span>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        </button>
      </Link>
    </div>
  );
};

export default DashboardBanner;
