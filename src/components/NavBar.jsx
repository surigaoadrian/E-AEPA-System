import React, { useEffect, useState } from "react";
import logo from "../assets/e-AEPA-logo.png";
import profile from "../assets/rick.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NavBar() {
  const [loggedUserData, setLoggedUserData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const role = sessionStorage.getItem("userRole");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = sessionStorage.getItem("userID");

        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userID}`
        );

        setLoggedUserData(response.data);
        console.log(userID);
        console.log(loggedUserData);
      } catch (error) {
        if (error.response) {
          //not in 200 response range
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${error.message}`);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userID");

    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate("/viewProfile");
  };

  const navBarStyle = {
    height: "8vh",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
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
          marginRight: "0px",
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
            {loggedUserData.fName} {loggedUserData.lName}
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
            {loggedUserData.role === "ADMIN"
              ? "Admin"
              : `${loggedUserData.dept} - ${loggedUserData.position}`}
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
      <div className="nav-logout">
        <Button
          variant="text"
          size="tiny"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            minWidth: 27,
            width: 27,
            padding: 0,
            minHeight: "auto",
            height: 25,
            borderRadius: "50%",
            margin: "0px 10px 0px 10px",
          }}
        >
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{
              fontSize: "18px",
              color: "#8C383E",
            }}
          />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {role === "EMPLOYEE" ? (
            <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
          ) : null}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default NavBar;
