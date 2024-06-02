import React, { useEffect, useState } from "react";
import logo from "../assets/e-AEPA-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCaretDown,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ListItemIcon } from "@mui/material";
import profile from "../assets/logo.png";

function NavBar() {
  const [loggedUserData, setLoggedUserData] = useState({});
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
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

  const getImageUrl = async (userID) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/image/${userID}`,
        {
          responseType: "arraybuffer",
        }
      );
      const imageBlob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  };

  // useEffect(() => {
  //   const getImageUrl = async (userID) => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/user/image/${userID}`,
  //         {
  //           responseType: "arraybuffer",
  //         }
  //       );
  //       const imageBlob = new Blob([response.data], {
  //         type: response.headers["content-type"],
  //       });
  //       const imageUrl = URL.createObjectURL(imageBlob);
  //       return imageUrl;
  //     } catch (error) {
  //       console.error("Error fetching profile picture:", error);
  //       return null;
  //     }
  //   };

  //   getImageUrl();
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userID}`
        );
        setLoggedUserData(response.data);
        if (response.data.role !== "ADMIN" && response.data.role !== "HEAD") {
          const imageUrl = await getImageUrl(userID);
          setProfilePictureUrl(imageUrl);
        } else {
          setProfilePictureUrl(profile); // Default profile picture for admin
        }
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
              fontWeight: 500,
              fontSize: "11px",
              color: "#8C383E",
              marginTop: "10px",
              lineHeight: "5px",
            }}
            variant="h6"
            gutterBottom
          >
            {loggedUserData.fName} {loggedUserData.lName}
          </Typography>
          <Typography
            sx={{
              fontFamily: "poppins",
              fontWeight: 500,
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
      </div>
      <div className="nav-profile-picture">
        <div
          className="nav-profile-img rounded-full "
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #8C383E",
          }}
        >
          <img
            src={profilePictureUrl}
            alt="nav-profile-picture"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="rounded-full ring-4 ring-black"
          />
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
          className={open ? "active" : ""}
          sx={{
            minWidth: 27,
            width: 27,
            padding: 0,
            minHeight: "auto",
            height: 25,
            borderRadius: "50%",
            margin: "0px 20px 0px 0px",
            color: "#8C383E",
            "&:hover": {
              backgroundColor: "rgba(140, 56, 62, 0.2)",
              color: "#8C383E",
            },
          }}
        >
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{
              fontSize: "15px",
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
          <MenuItem
            onClick={handleLogout}
            sx={{
              margin: "0 5px 0 5px",
              "&:hover": {
                borderRadius: "5px",
                margin: "0 5px 0 5px",
              },
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{
                  backgroundColor: "#EFEFEF",
                  color: "#8C383E",
                  borderRadius: "50%",
                  padding: "5px",
                  fontSize: "14px",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "14px",
                margin: "0 30px 0 7px",
              }}
            >
              Log Out
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default NavBar;
