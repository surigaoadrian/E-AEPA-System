import React from "react";
import { NavLink } from "react-router-dom";
import notAuthorized from "../assets/not-authorized.png";

function NotAuthorized() {
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
        <h1 style={{ fontSize: "150px", fontWeight: 700, color: "#8C383E" }}>
          403
        </h1>
        <h2
          style={{ fontSize: "32px", marginBottom: "20px", color: "#636E72" }}
        >
          Access Forbidden
        </h2>
        <p style={{ fontSize: "16px", color: "#636E72" }}>
          Sorry, you don't have the permission to access the requested page.{" "}
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: 500,
              color: "#8C383E",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Go back to Home.
          </NavLink>
        </p>
      </div>
      <div>
        <img
          style={{ height: "100%", paddingBottom: "111px" }}
          src={notAuthorized}
          alt="search-logo"
        />
      </div>
    </div>
  );
}

export default NotAuthorized;
