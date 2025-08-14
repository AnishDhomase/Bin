import React from "react";

const ToastLogin = ({
  headline = "Login Success",
  subHeadline = "Successfully logged in",
}) => {
  return (
    <div className="flex gap-3 p-4 items-center bg-[#c6defe]">
      <img
        src="/images/login.png"
        alt="warn"
        className="w-9 h-9 flex-shrink-0"
      />
      <div>
        <h3 className="font-semibold text-[#1a1d2c]">{headline}</h3>
        <p className="text-sm text-[#1a1c2c95]">{subHeadline}</p>
      </div>
    </div>
  );
};

export default ToastLogin;
