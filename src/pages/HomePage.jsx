import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Showcase from "../components/Showcase";

function HomePage() {
  return (
    <>
      {/* Navbar Section*/}
      <NavBar />
      {/* Sidebar Section*/}
      <div style={{ display: "flex" }}>
        <SideBar />
        <Showcase />
      </div>
    </>
  );
}

export default HomePage;
