import React from "react";

const ToastError = ({
  headline = "Action Failed",
  subHeadline = "Action failed due to server error",
}) => {
  return (
    <div className="flex gap-3 p-4 items-center bg-[#FFEAE9]">
      <img
        src="/images/warning.png"
        alt="warn"
        className="w-9 h-9 flex-shrink-0"
      />
      <div>
        <h3 className="font-semibold text-[#2c1b1a]">{headline}</h3>
        <p className="text-sm text-[#2c1b1a95]">{subHeadline}</p>
      </div>
    </div>
  );
};

export default ToastError;
