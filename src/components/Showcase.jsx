import React from "react";
import { Outlet } from "react-router-dom";

function Showcase() {
  const showcaseStyles = {
    height: "92vh",
    width: "100%",
    backgroundColor: "#f5f4f6",
    borderTop: "3px solid #8C383E",
  };
  

  return (
    <div style={showcaseStyles}>
      <Outlet />
    </div>
  );
}

export default Showcase;
