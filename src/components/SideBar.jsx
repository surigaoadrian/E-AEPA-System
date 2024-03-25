import React from "react";
import ViewProfilePage from "../pages/ViewProfilePage";
import ViewRatingsPage from "../pages/ViewRatingsPage";

function SideBar() {
  const sidebarStyles = {
    height: "92vh",
    width: "229px",
    backgroundColor: "yellow",
  };

  return (
    <div style={sidebarStyles}>
      <ViewProfilePage />
      {/* <ViewRatingsPage /> */}
    </div>
  );
}

export default SideBar;
