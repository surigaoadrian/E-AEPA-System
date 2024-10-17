import React, { useEffect, useState } from "react";
import logo from "../assets/e-AEPA-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCaretDown,
  faSignOutAlt,
  faUser,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  ListItemIcon,
  TextField,
} from "@mui/material";
import profile from "../assets/logo.png";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { apiUrl } from "../config/config";
import { jwtDecode } from "jwt-decode";
import SessionExpiredModal from "../modals/SessionExpiredModal";

function NavBar() {
  const [loggedUserData, setLoggedUserData] = useState({});
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState("");
  const [targetUsername, setTargetUsername] = useState("");
  const [password, setPassword] = useState("");
  const displayEmpUsername = loggedUserData?.username
    ? loggedUserData.username.replace(/^adm_/, "")
    : "";
  const displayAdmUsername = loggedUserData?.username
    ? `adm_${loggedUserData.username}`
    : "";
  const [message, setMessage] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [hasAdminAccount, setHasAdminAccount] = useState(false);
  const [hasEmpAccount, setHasEmpAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("userRole");

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Token expiry check function
  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log("Checking token expiration...");

      if (decodedToken.exp < currentTime) {
        console.log("Token expired!");
        localStorage.removeItem("token");

        setIsSessionExpired(true); // Show session expiration modal
        console.log("State set to isSessionExpired: ", true);
      }
    }
  };

  // Set up token expiration check on mount and periodically
  useEffect(() => {
    checkTokenExpiry(); // Run check on component mount
    const intervalId = setInterval(checkTokenExpiry, 3000); // Check every 3 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userID");
    navigate("/login");
  };

  const handleCloseSessionExpiredModal = () => {
    console.log("Closing modal and redirecting to login...");
    setIsSessionExpired(false);
    navigate("/login"); // Redirect to login page
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setMessage("");
    setOpenPasswordModal(false);
    setAnchorEl(null);
  };

  const getImageUrl = async (userID) => {
    try {
      const response = await axios.get(`${apiUrl}user/image/${userID}`, {
        responseType: "arraybuffer",
      });
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
  function base64ToDataURL(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const response = await axios.get(`${apiUrl}user/getUser/${userID}`);
        setLoggedUserData(response.data);

        // Check for admin account
        //  const adminUsername = `adm_${response.data.username}`;
        const checkAdminResponse = await axios.get(
          `${apiUrl}checkAdminAccount/${response.data.username}`
        );
        setHasAdminAccount(checkAdminResponse.data);

        const checkEmpResponse = await axios.get(
          `${apiUrl}checkEmpAccount/${response.data.username}`
        );
        setHasEmpAccount(checkEmpResponse.data);
        console.log("Has Employee account:", checkEmpResponse.data);
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) setMessage(""); // Clear error message on user input
  };

  const handleSwitchAccount = (role) => {
    setTargetRole(role);
    // Determine the new username based on the role
    const newUsername =
      role === "EMPLOYEE" ? displayEmpUsername : displayAdmUsername;
    setTargetUsername(newUsername);
    setMessage("");
    setPassword("");
    setOpenPasswordModal(true);
  };
  const handleSwitchConfirm = async () => {
    setMessage("");
    try {
      const response = await axios.post(`${apiUrl}swapAccount`, {
        username: targetUsername,
        password: password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userRole", targetRole);
        sessionStorage.setItem("userID", response.data.userID);

        // Fetch new user data
        const userID = sessionStorage.getItem("userID");
        const userResponse = await axios.get(
          "${apiUrl}/user/getUser/${userID}"
        );

        // Update state and handle navigation
        setLoggedUserData(userResponse.data);
        console.log("Logged in as", userResponse.data.role);
        console.log("successfully switched account");
        window.location.reload();
        navigate("/"); // Navigate to home or another page
        handleClose(); // Close the dialog
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      setTimeout(() => setMessage("Password is invalid"), 0);

      console.error("Error during account swap:", error);
    }
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
              : loggedUserData.role === "SUPERUSER"
              ? "Superuser"
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
            src={
              loggedUserData?.profilePic
                ? base64ToDataURL(loggedUserData.profilePic)
                : "/user.png"
            }
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
          {loggedUserData.role === "EMPLOYEE" && hasAdminAccount && (
            <MenuItem
              onClick={() => handleSwitchAccount("ADMIN")}
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
                  icon={faRightLeft}
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
                Switch as Admin
              </Typography>
            </MenuItem>
          )}
          {loggedUserData.role === "ADMIN" && hasEmpAccount && (
            <MenuItem
              onClick={() => handleSwitchAccount("EMPLOYEE")}
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
                  icon={faRightLeft}
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
                Switch as Employee
              </Typography>
            </MenuItem>
          )}

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
      <Dialog maxWidth="xs" open={openPasswordModal} onClose={handleClose}>
        <Box
          sx={{
            bgcolor: "#8c383e",
            height: "2em",
            width: "100%",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Grid
                container
                spacing={0.6}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  color: "white",
                  backgroundColor: "transparent",
                  alignItems: "center",
                }}
              >
                <Grid item sx={{ height: "2.3em", mt: ".3em" }}>
                  <FontAwesomeIcon
                    icon={faRightLeft}
                    style={{
                      color: "#EFEFEF",
                      padding: "7px",
                      fontSize: "14px",
                    }}
                  />
                </Grid>
                <Grid item>Switch Account</Grid>
              </Grid>
            </Grid>
          </Grid>
          <IconButton
            onClick={handleClose}
            sx={{ "&:hover": { color: "#F8C702" } }}
          >
            <HighlightOffOutlinedIcon
              sx={{ fontSize: "1em", color: "white" }}
            />
          </IconButton>
        </Box>
        <div style={{ display:'flex', justifyContent:'center',paddingLeft:'1em', paddingRight:'1em', paddingTop:'1em'}}>
          <Box sx={{ bgcolor: 'rgba(128, 128, 128, 0.2)', height: '8.2vh', borderRadius: '.5em', display: 'flex', justifyContent: 'center' }}>
            <Typography style={{ padding: '5px', fontFamily: 'Poppins', fontSize: '12px', }}> You're about to switch to <span style={{ fontStyle: 'italic', color: '#8c383e', fontWeight: 600 }}>'{targetUsername}'</span>, your <span style={{ fontStyle: 'italic', fontWeight: 500 }}>{targetRole}</span> account. Please confirm the switch by entering the <span style={{ fontWeight: 700 }}>password</span> for <span style={{ fontStyle: 'italic', color: '#8c383e', fontWeight: 600 }}>'{targetUsername}'</span>.</Typography>
          </Box>
        </div>

        <form
          onSubmit={handleSwitchConfirm}
          style={{
            display: 'flex',
            flexDirection: 'column',
             // Center contents horizontally
            padding: '.5em',
              width: '100%',
          }}
        >
          <DialogContent>
            <DialogContentText style={{ fontFamily: 'Poppins', fontSize: '15px' }}>
              {/* <div style={{display: 'flex', gap: '0.5em' }}> */}
                <div style={{ display: 'flex', alignItems: 'left',}}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: 'Poppins', fontSize: '.9em', mr: "10px", mt: '8px' }}

                  >
                    Password:
                  </Typography>
                  <TextField
                    placeholder="Enter Password"
                    size="small"
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    inputProps={{ style: { fontFamily: 'Poppins', fontSize: '.9em' } }}
                    style={{ width: '60%' }}
                  />
                </div>
                {message && (
                  <FormHelperText style={{ color: 'red', fontSize: '12px', fontFamily: 'Poppins', marginLeft: "7em"}}>
                    {message}
                  </FormHelperText>
                )}
              {/* </div> */}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'center', width: '100%', }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#8C383E',
                borderRadius: '5px',
                textTransform: 'none',
                width: '35%',
                fontFamily: 'Poppins',
                color: 'white',
                
                '&:hover': { bgcolor: '#762F34', color: 'white' },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <SessionExpiredModal
        open={isSessionExpired}
        handleClose={handleCloseSessionExpiredModal}
      />
    </div>
  );
}

export default NavBar;
