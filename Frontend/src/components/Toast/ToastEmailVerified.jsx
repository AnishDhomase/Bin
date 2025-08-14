import React from "react";

const ToastEmailVerified = () => {
  return (
    <div className="flex gap-3 p-4 items-center bg-[#fffee9]">
      <img
        src="/images/emailVerified.png"
        alt="warn"
        className="w-9 h-9 flex-shrink-0"
      />
      <div>
        <h3 className="font-semibold text-[#2c2a1a]">Email verified</h3>
        <p className="text-sm text-[#2c2c1a95]">
          Email verification Successfull
        </p>
      </div>
    </div>
  );
};

export default ToastEmailVerified;
