import React from "react";
import logo from "../assets/e-AEPA-logo.png";
import profile from "../assets/rick.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";

function NavBar() {
  const navBarStyle = {
    height: "8vh",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    // borderImage:
    //   "linear-gradient(to right, #8C383E 15%, #F8C702 15%, #F8C702 100%)",
    // borderImageSlice: 1,
    // borderImageWidth: "0px 0px 4px 0px",
  };

  return (
    <div style={navBarStyle}>
      <div className="nav-logo" style={{ flex: "1", marginLeft: "20px" }}>
        <img style={{ width: "130px" }} src={logo} alt="e-aepa-logo" />
      </div>
      <div className="nav-notif" style={{ marginRight: "20px" }}>
        <button
          style={{
            height: "30px",
            width: "30px",
            borderRadius: "100%",
            padding: "5px",
            border: "none",
            backgroundColor: "#8C383E",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={faBell}
            style={{ fontSize: "15px", color: "#FFFFFF" }}
          />
        </button>
      </div>
      <div
        className="nav-profile"
        style={{
          display: "flex",
          marginRight: "20px",
        }}
      >
        <div
          className="nav-profile-label"
          style={{
            marginRight: "10px",
            textAlign: "end",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "poppins",
              fontWeight: 400,
              fontSize: "11px",
              color: "#8C383E",
              marginBottom: "0px",
            }}
            variant="h6"
            gutterBottom
          >
            John Doe
          </Typography>
          <Typography
            sx={{
              fontFamily: "poppins",
              fontWeight: 400,
              fontSize: "10px",
            }}
            variant="h6"
            gutterBottom
          >
            MIS-Staff
          </Typography>
        </div>
        <div className="nav-profile-picture">
          <div
            className="nav-profile-img"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={profile}
              alt="nav-profile-picture"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
