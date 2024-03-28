import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Showcase from "../components/Showcase";

function Layout() {
  return (
    <>
      <NavBar />
      <div style={{ display: "flex" }}>
        <SideBar />
        <Showcase />
      </div>
    </>
  );
}

export default Layout;
