import React from "react";

const Logo = ({ noMargin = false }) => {
  return (
    <img
      src="/images/BinLogo.png"
      alt="Description"
      className={`h-[55px] ${noMargin ? "" : "my-0 mx-auto"}`}
      //   style={{
      //     height: "55px",
      //     margin: noMargin ? "0" : "0 auto",
      //   }}
    />
  );
};

export default Logo;
