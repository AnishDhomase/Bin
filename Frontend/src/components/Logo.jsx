import React from "react";

const Logo = ({ noMargin = false, size = "55" }) => {
  return (
    <img
      src="/images/BinLogo.png"
      alt="Description"
      className={`h-[55px] ${noMargin ? "" : "my-0 mx-auto"}`}
      style={{
        height: `${size}px`,
      }}
    />
  );
};

export default Logo;
