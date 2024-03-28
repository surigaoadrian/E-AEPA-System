import React from "react";
import { NavLink } from "react-router-dom";
import searchLogo from "../assets/search.png";

function NotFoundPage() {
  const container = {
    height: "100vh",
    width: "80%",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const pageText = {
    minHeight: "70vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  };

  return (
    <div style={container}>
      <div style={pageText}>
        <h1 style={{ fontSize: "150px", color: "#8C383E" }}>404</h1>
        <h2
          style={{ fontSize: "32px", marginBottom: "20px", color: "#636E72" }}
        >
          Page Not Found
        </h2>
        <p style={{ fontSize: "16px", color: "#636E72" }}>
          The link you followed may be broken, or the page may have been
          removed.{" "}
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: "400",
            }}
          >
            Go back to Home.
          </NavLink>
        </p>
      </div>
      <div>
        <img style={{ height: "500px" }} src={searchLogo} alt="search-logo" />
      </div>
    </div>
  );
}

export default NotFoundPage;
