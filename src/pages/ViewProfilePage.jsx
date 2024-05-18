import { Alert as MuiAlert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, IconButton, MenuItem, Paper, Snackbar, TextField, Tooltip, Typography, Select, FormHelperText, FormControl } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from "axios";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const CustomAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} >
      <MuiAlert elevation={6} variant="filled" severity={severity} style={{ fontFamily: "Poppins" }}> {message} </MuiAlert>
    </Snackbar>
  );
};

function ViewProfilePage() {
  const userID = sessionStorage.getItem("userID");
  const [openSeePictureDialog, setOpenSeePictureDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [isPrsnlEditMode, setIsPrsnlEditMode] = useState(false);
  const [isAccntEditUnameMode, setIsAcctEditUnameMode] = useState(false);
  const [isAccntEditPassMode, setIsAcctEditPassMode] = useState(false);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: "", });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "" });
  const [msgInfo, setMsgInfo] = useState("");
  const isAvailable = msgInfo === "Username available";
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [prevProfilePictureUrl, setPrevProfilePictureUrl] = useState(null);

  const showSuccessAlert = (message) => {
    setSuccessAlert({ open: true, message });
  };

  const showErrorAlert = (message) => {
    setErrorAlert({ open: true, message });
  };

  const handlePrsnlEditClick = () => {
    setIsPrsnlEditMode(!isPrsnlEditMode);
  };

  const handleAccntEditUnameClick = () => {
    setIsAcctEditUnameMode(!isAccntEditUnameMode);
  };

  const handleAccntEditPassClick = () => {
    setIsAcctEditPassMode(!isAccntEditPassMode);
  };

  const handlePrsnlEditClose = () => {
    setSelectedUser(originalUser);
    setIsPrsnlEditMode(false);
    setSaveDisabled(false);
  };

  const handleAccntUnameClose = () => {
    setSelectedUser(originalUser);
    setSaveDisabled(false);
    setIsAcctEditUnameMode(false);
    setMsgInfo("");
  };

  const handleAccntPassClose = () => {
    setSelectedUser(originalUser);
    setIsAcctEditPassMode(false);
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.put(`http://localhost:8080/user/checkUsername/${username}`);
      return response.data; // Returns "Username already taken" or "Username available"
    } catch (error) {
      console.error("Error checking username availability:", error);
      return "Failed to check username availability";
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const onlyLettersRegex = /^[A-Za-z]+$/;
    const onlyNumbersRegex = /^[0-9]+$/;

    let trimmedValue = value;

    if (name === "fName" || name === "mName" || name === "lName") {
      if (!onlyLettersRegex.test(value) && value !== "") return;
    } else if (name === "contactNum") {
      trimmedValue = value.slice(0, 11);
      if (trimmedValue !== "" && !trimmedValue.startsWith("09")) {
        trimmedValue = "09" + trimmedValue;
      }
      if (!onlyNumbersRegex.test(trimmedValue) && trimmedValue !== "") return;
    }
    if (name === "username") {
      checkUsernameAvailability(value)
        .then((availability) => {
          console.log("Username availability:", availability);
          if (availability === "Username already taken") {
            setMsgInfo("Username already taken");
            setSaveDisabled(false);
          } else {
            setMsgInfo("");
            setSaveDisabled(true);
          }
        })
        .catch((error) => {
          console.error("Error checking username availability:", error);
        });
    }
    setSelectedUser((prevData) => ({
      ...prevData,
      [name]: trimmedValue,
    }));
    if (trimmedValue.trim() === "" || selectedUser.fName.trim() === "" || selectedUser.mName.trim() === "" || selectedUser.lName.trim() === "") {
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  };

  //save edit username 
  const handleSaveUsernameChanges = async (e, selectedUser) => {
    e.preventDefault();
    try {
      console.log("sending user data: ", selectedUser);

      const userPayload = {
        username: selectedUser.username,
      };
      await axios.patch(`http://localhost:8080/user/editAccountUsername/${selectedUser.userID}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateFetch((prev) => !prev);
      setOriginalUser(selectedUser);
      showSuccessAlert("User updated successfully");
      setIsAcctEditUnameMode(false);
      setSaveDisabled(false);
    } catch (error) {

      showErrorAlert("Failed to update user. Please try again later.");
    }
  };

  //save edit personal details
  const handleSavePrsnlChanges = async (e, selectedUser) => {
    e.preventDefault();
    try {
      console.log("sending user data: ", selectedUser);
      if (selectedUser.contactNum.length !== 11) {
        showErrorAlert("Mobile number should be exactly 11 numbers.");
        return; // Prevent saving if the mobile number is not exactly 11 numbers long
      }
      const userPayload = {
        fName: selectedUser.fName,
        mName: selectedUser.mName,
        lName: selectedUser.lName,
        gender: selectedUser.gender,
        contactNum: selectedUser.contactNum,
      };
      await axios.patch(`http://localhost:8080/user/editPersonalDetails/${selectedUser.userID}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateFetch((prev) => !prev);
      setOriginalUser(selectedUser);
      showSuccessAlert("User updated successfully");
      setIsPrsnlEditMode(false);
      setSaveDisabled(false);
    } catch (error) {
      showErrorAlert("Failed to update user. Please try again later.");
    }
  };

  //fetch the user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/getUser/${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setSelectedUser(data);
        setOriginalUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userID]);

  //CHANGING PROFILE PICTURE & FETCHING IMAGE
  const getImageUrl = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/image/${userID}`, {
        responseType: 'arraybuffer'  // Ensure response is treated as binary data
      });
      const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
      const imageUrl = URL.createObjectURL(imageBlob);

      return imageUrl;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      throw error; // Propagate the error back to the caller
    }
  };
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const imageUrl = await getImageUrl();
        setProfilePictureUrl(imageUrl);
      } catch (error) {
        // Error handling
      }
    };

    fetchProfilePicture();
  }, [userID]);
  const handleSeePictureDialog = async () => {
    setOpenSeePictureDialog(true);

  };
  const handleCancel = () => {
    setImage(null);
    if (prevProfilePictureUrl) {
      setProfilePictureUrl(prevProfilePictureUrl); // Restore the previous profile picture URL
    }
    
  };
  const handleImageClick = () => {
    inputRef.current.click();
  }
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPrevProfilePictureUrl(profilePictureUrl);
    const imageUrl = URL.createObjectURL(file);
    setProfilePictureUrl(imageUrl);
  }
  const handleSavePicture = async () => { //SAVE THE PICTURE
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    try {
      await axios.post(`http://localhost:8080/user/uploadImage/${userID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = await getImageUrl(); //FETCH THE IMAGE
      setProfilePictureUrl(imageUrl);
      setOpenSeePictureDialog(false);
      setImage(null);//pra mobalik sa chnagepicture na button
      showSuccessAlert("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleCloseDialog = () => {
    setImage(null);
    if (prevProfilePictureUrl) {
      setProfilePictureUrl(prevProfilePictureUrl); // Restore the previous profile picture URL
    }
    setOpenSeePictureDialog(false);
  };

  return <div>
    <Grid container>
      <Grid item xs={6}>
        <Typography ml={5} mt={4} sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}> Profile </Typography>
      </Grid>
    </Grid>
    <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { ml: 2, width: "97%", }, }} >
      <Grid container spacing={1.5} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", }}>
        <Paper elevation={0} sx={{ borderRadius: "5px", width: "100%", height: "10em", mt: 2.5, ml: 3 }}>
          <Grid container spacing={2}>
            <Grid item>
              <IconButton onClick={handleSeePictureDialog} size="small" sx={{ ml: 5, mt: 3 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} >
                <Tooltip title="Profile Picture" placement="top" arrow>
                  {profilePictureUrl ?
                    <Avatar sx={{ width: 110, height: 110 }} src={profilePictureUrl} />
                    :
                    <Avatar sx={{ width: 110, height: 110 }} />
                  }
                </Tooltip>
              </IconButton>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2} sx={{ ml: 2 }}>
                <Grid item xs sx={{ mt: 3.5 }}>
                  <Typography gutterBottom component="div" sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '1.3em' }}>
                    {selectedUser.fName} {selectedUser.lName}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.9em' }}>
                    Employee ID #: <span style={{ color: 'black', fontWeight: 'bold' }}>{selectedUser.workID}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 1, fontSize: '.9em' }}>
                    Position: <span style={{ color: 'black' }}>{selectedUser.position}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 1, fontSize: '.9em' }}>
                    Department: <span style={{ color: 'black' }}>{selectedUser.dept} </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2} >
                <Grid item xs sx={{ mt: 8.3 }}>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.9em' }}>
                    Employment Status: <span style={{ color: selectedUser.empStatus === 'Regular' ? '#F8C702' : '#8C383E' }}>{selectedUser.empStatus}</span>
                  </Typography>
                  {selectedUser.empStatus !== 'Regular' && (
                    <>
                      <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 1, fontSize: '.9em' }}>
                        Probationary Status: <span style={{ color: 'black' }}>{selectedUser.probeStatus}</span>
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 1, fontSize: '.9em' }}>
                        Probationary Date Started: <span style={{ color: 'black' }}>{selectedUser.dateStarted}</span>
                      </Typography>
                    </>
                  )}

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={(.9)}>
          <Grid item xs={5.85} sx={{ mt: 1 }}>
            <Paper elevation={0} sx={{ borderRadius: "5px", width: "99%", height: "12.5em", ml: 3 }}>
              <Grid item xs={12} sm container>
                <Grid item xs container spacing={2} sx={{ ml: 1 }}>
                  <Grid item xs >
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '1.3em', mt: 1 }}>Personal Details</Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "right", height: '3em', mr: '1em', mt: .5 }} >
                    {!isPrsnlEditMode && (
                      <Tooltip title="Edit Details" arrow>
                        <IconButton onClick={handlePrsnlEditClick}>
                          <BorderColorRoundedIcon sx={{ fontSize: "1em", color: 'rgba(140, 56, 62, 0.5)', "&:hover": { color: "#8c383e", }, }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {/* for edit  */}
              {isPrsnlEditMode ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 2, }}>First Name:</Typography>
                    <TextField type="text" name="fName" value={selectedUser.fName} onChange={handleDetailsChange} variant="outlined" size="small" sx={{ ml: 3.2, mt: 1.5, width: '10em' }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: '.8em' }, }} inputProps={{ style: { fontSize: ".8em", fontFamily: "Poppins", }, }} />
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 9.2, mt: 2, }}>Gender:</Typography>
                    <Select labelId="gender" id="gender" value={selectedUser.gender} name="gender" sx={{ ml: 1, mt: 1.5, mr: 4, width: '10em', height: '2.5em', fontSize: '.9em', fontFamily: 'Poppins', }} onChange={handleDetailsChange}>
                      <MenuItem value={"Female"}>Female</MenuItem>
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 2 }}>Middle Name:</Typography>
                    <TextField type="text" name="mName" value={selectedUser.mName} onChange={handleDetailsChange} variant="outlined" size="small" sx={{ ml: 1, mt: 1.5, width: '10em' }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: '.8em' }, }} inputProps={{ style: { fontSize: ".8em", fontFamily: "Poppins", }, }} />
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 2, }}> Mobile Number: </Typography>
                    <TextField type="text" name="contactNum" value={selectedUser.contactNum} onChange={handleDetailsChange} variant="outlined" size="small" sx={{ ml: 1, mt: 1.5, width: '10em' }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", }, }} inputProps={{ style: { fontSize: ".8em", fontFamily: "Poppins", }, }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 2 }}>Last Name: </Typography>
                    <TextField type="text" name="lName" value={selectedUser.lName} onChange={handleDetailsChange} variant="outlined" size="small" sx={{ ml: 3.2, mt: 1.5, width: '10em' }}
                      InputLabelProps={{ style: { fontFamily: "Poppins", }, }} inputProps={{ style: { fontSize: ".8em", fontFamily: "Poppins", }, }} />
                    <Button variant="contained" onClick={(e) => handleSavePrsnlChanges(e, selectedUser)}
                      sx={{
                        height: "2em", width: "7em", mr: 2, ml: 10, mt: 3, fontFamily: "Poppins", backgroundColor: "#8c383e", padding: "1px 1px 0 0 ",
                        "&:hover": { backgroundColor: "#F8C702", color: "black", },
                      }} style={{ textTransform: "none", }}
                      startIcon={<SaveAsRoundedIcon />}
                      disabled={!saveDisabled}
                    >Save </Button>
                    <Button variant="contained"
                      sx={{
                        color: 'black', height: "2em", width: "7em", mr: 2, mt: 3, fontFamily: "Poppins", backgroundColor: "hsl(0, 0%, 78%)", padding: "1px 1px 0 0 ",
                        "&:hover": { backgroundColor: "#a9a9a9", color: "white", },
                      }} style={{ textTransform: "none", }}
                      startIcon={<CancelOutlinedIcon />}
                      onClick={handlePrsnlEditClose}
                    >Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* for display only */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2} sx={{ ml: 1 }}>
                        <Grid item xs >
                          <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 3, fontSize: '1em' }}>
                            First Name: <span style={{ color: 'black' }}>{selectedUser.fName}</span>
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 3, fontSize: '1em' }}>
                            Middle Name: <span style={{ color: 'black' }}>{selectedUser.mName}</span>
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 3, fontSize: '1em' }}>
                            Last Name: <span style={{ color: 'black' }}>{selectedUser.lName}</span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2} >
                        <Grid item xs sx={{ mt: 3 }}>
                          <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '1em' }}>
                            Gender: <span style={{ color: 'black' }}>{selectedUser.gender}</span>
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 3, fontSize: '1em' }}>
                            Mobile Number: <span style={{ color: 'black' }}>{selectedUser.contactNum}</span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ mt: 1 }}>
            <Paper elevation={0} sx={{ borderRadius: "5px", width: "99%", height: "12.5em", ml: 2.7 }}>
              <Grid item xs={12} sm container>
                <Grid item xs container spacing={2} sx={{ ml: 1 }}>
                  <Grid item xs >
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '1.3em', mt: 1 }}>Account Details</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sm container>
                <Grid item xs container spacing={2} sx={{ ml: 1 }}>
                  {/* for editing */}
                  {isAccntEditUnameMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 2, mt: 4 }}> Username:</Typography>
                        <FormControl >
                          <TextField type="text" id="username" name="username" value={selectedUser.username} onChange={handleDetailsChange} variant="outlined" size="small" sx={{ ml: 1, mt: 3.5, }}
                            InputLabelProps={{ style: { fontFamily: "Poppins", }, }} inputProps={{ style: { fontSize: ".8em", fontFamily: "Poppins", }, }} />
                        </FormControl>
                        <Grid sx={{ mt: 3, ml: 1 }}>
                          <Tooltip title="Save Changes" placement="top" arrow>
                            <IconButton onClick={(e) => handleSaveUsernameChanges(e, selectedUser)}
                              sx={{
                                height: "1.3em", width: "1.2em", fontFamily: "Poppins", padding: "1px 1px 0 0 ", color: 'green',
                                "&:hover": { bgcolor: 'transparent', color: "#F8C702", },
                              }} style={{ textTransform: "none", }}

                              disabled={!saveDisabled}
                            ><SaveAsRoundedIcon sx={{ fontSize: '.8em' }} /></IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Changes" placement="top" arrow>
                            <IconButton
                              sx={{
                                color: 'black', height: "1.3em", width: "1.3em", fontFamily: "Poppins", padding: "1px 1px 0 0 ",
                                "&:hover": { bgcolor: 'transparent', color: "#8C383E", },
                              }} style={{ textTransform: "none", }}

                              onClick={handleAccntUnameClose}
                            ><CancelOutlinedIcon sx={{ fontSize: '.8em' }} />
                            </IconButton>
                          </Tooltip>

                        </Grid>
                      </div>
                      {!isAvailable && (
                        <FormHelperText
                          style={{
                            color: "red",
                            marginLeft: 95,
                            marginTop: '-10px',
                            fontFamily: "Poppins",
                            fontSize: "0.6em",
                          }}
                        >
                          {msgInfo}
                        </FormHelperText>
                      )}
                    </div>
                  ) : (
                    // for display only
                    <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '1em', mt: 5, ml: 2 }}>
                      Username: <span style={{ color: 'black' }}>{selectedUser.username}</span>
                    </Typography>
                  )}
                  <Grid item xs sx={{ display: "flex", justifyContent: "left", height: '3em', mr: '1em', mt: 2, }} >
                    {!isAccntEditUnameMode && (
                      <Tooltip title="Change Username" placement="right" arrow>
                        <IconButton onClick={handleAccntEditUnameClick}>
                          <BorderColorRoundedIcon sx={{
                            fontSize: ".8em", color: 'rgba(140, 56, 62, 0.5)',
                            "&:hover": { color: "#8c383e", },
                          }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm container>
                {/* for edit */}
                {isAccntEditPassMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 1, }}>Current Password:</Typography>
                      <TextField type="password" variant="outlined" size="small" sx={{ ml: 1, mt: 1, width: '12em', fontSize: '.8em', fontFamily: 'Poppins' }} />
                      <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: 1 }}>New Password:</Typography>
                      <TextField type="password" variant="outlined" size="small" sx={{ ml: 1, mt: 1, width: '12em', fontSize: '.8em', fontFamily: 'Poppins' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '.8em', ml: 3, mt: .6 }}>Confirm New Password: </Typography>
                      <TextField type="password" variant="outlined" size="small" sx={{ ml: 1, fontSize: '.8em', width: '12.5em', fontFamily: 'Poppins' }} />
                      <Button variant="contained"
                        sx={{
                          height: "2em", width: "7em", mr: 1, ml: 5, fontFamily: "Poppins", backgroundColor: "#8c383e", padding: "1px 1px 0 0 ",
                          "&:hover": { backgroundColor: "#F8C702", color: "black", },
                        }}
                        style={{ textTransform: "none", }}
                        startIcon={<SaveAsRoundedIcon />}
                      >Save</Button>
                      <Button variant="contained"
                        sx={{
                          color: 'black', height: "2em", width: "7em", mr: 2, fontFamily: "Poppins", backgroundColor: "hsl(0, 0%, 78%)", padding: "1px 1px 0 0 ",
                          "&:hover": { backgroundColor: "#a9a9a9", color: "white", },
                        }}
                        style={{ textTransform: "none", }}
                        startIcon={<CancelOutlinedIcon />}
                        onClick={handleAccntPassClose}
                      >Cancel</Button>
                    </div>
                  </div>
                ) : (
                  //for display only
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '1em', mt: 3, ml: 3 }}>
                    Password: <span style={{ color: 'black' }}>**********</span>
                  </Typography>
                )}
                <Grid item xs sx={{ display: "flex", justifyContent: "left", height: '2em', ml: 2, mt: 2 }} >
                  {!isAccntEditPassMode && (
                    <Tooltip title="Change Password" placement="right" arrow>
                      <IconButton onClick={handleAccntEditPassClick}>
                        <BorderColorRoundedIcon sx={{
                          fontSize: ".8em", color: 'rgba(140, 56, 62, 0.5)',
                          "&:hover": { color: "#8c383e", },
                        }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Paper elevation={0} sx={{ borderRadius: "5px", width: "100%", height: "13em", mt: .8, ml: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2} sx={{ ml: 2 }}>
                <Grid item xs >
                  <Typography gutterBottom component="div" sx={{ fontFamily: 'Poppins', fontWeight: 'bold', mt: .5, fontSize: '1.3em' }}>Work Details</Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 2, fontSize: '1em' }}>
                    Employee ID #: <span style={{ color: 'black', }}>{selectedUser.workID}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 2, fontSize: '1em' }}>
                    Department: <span style={{ color: 'black', }}>{selectedUser.dept}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 2, fontSize: '1em' }}>
                    Position: <span style={{ color: 'black', }}>{selectedUser.position}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 2, fontSize: '1em' }}>
                    Institutional Email: <span style={{ color: 'black', }}>{selectedUser.workEmail}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2} sx={{ ml: 2 }}>
                <Grid item xs sx={{ mt: 6.5 }}>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', fontSize: '1em' }}>
                    Date Hired: <span style={{ color: 'black', fontWeight: 'bold' }}>{selectedUser.dateHired}</span>
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins', mt: 2, fontSize: '1em' }}>
                    Signature: <span style={{ color: 'black', }}>{selectedUser.signature}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Dialog open={openSeePictureDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
        <Box sx={{ bgcolor: "#8c383e", height: "2em", width: "100%", display: "flex", justifyContent: "right", }}>
          <Grid container spacing={0.6} sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "white", backgroundColor: "transparent", display: "flex", mt: .5, justifyContent: "center", }}>
            <Grid item sx={{ fontSize: "1em" }}>Profile Picture</Grid>
          </Grid>
          <IconButton onClick={handleCloseDialog} sx={{ "&:hover": { color: "#F8C702", }, }}>
            <HighlightOffOutlinedIcon sx={{ fontSize: "1em", color: "white" }} />
          </IconButton>
        </Box>
        <DialogContent sx={{ width: '30em', height: '35em', }} >
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ width: '100%', height: '20em', display: 'flex', justifyContent: 'center', alignItems: 'center',mt:5 }}>
              {profilePictureUrl ?
                <Avatar sx={{ width: '75%', height: '100%' }} src={profilePictureUrl} onClick={handleImageClick} />
                :
                <Avatar sx={{ width: '75%', height: '100%' }} onClick={handleImageClick} />
              }
            </Box>
          </DialogContentText>
          <DialogActions sx={{ display: "flex", justifyContent: 'center', alignItems: 'center',mt:9 }}>
            {!image && (
              <Button component="label" type="submit" sx={{
                borderRadius: "20px",fontSize: "1em", bgcolor: "#8c383e", color: "white", width: "80%",
                "&:hover": { backgroundColor: "#F8C702", color: "black", },
              }}
                style={{ textTransform: "none", fontFamily: "Poppins", }} startIcon={<CameraAltOutlinedIcon />}> Change Picture
                <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={handleImageChange} />
              </Button>
            )}
            {image && (
              <>
                <Button component="label" type="submit" sx={{borderRadius:'25px', fontSize: "1em", color: "black", width: "30%", "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", }, }}
                  style={{ textTransform: "none", fontFamily: "Poppins", }} onClick={handleCancel}> Cancel </Button>
                <Button component="label" type="submit" sx={{borderRadius:'25px',bgcolor: "rgba(248, 199, 2, 0.7)", color: "black", fontSize: "1em", width: "50%",
                  "&:hover": { backgroundColor: "#F8C702", color: "black", },
                }}
                  style={{ textTransform: "none", fontFamily: "Poppins", }} onClick={handleSavePicture}>Save as Profile Picture
                </Button>
              </>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box >

    {/* render success alert */}
    <CustomAlert open={successAlert.open} onClose={() => setSuccessAlert({ ...successAlert, open: false })} severity="success" message={successAlert.message} />
    {/* Render error alert */}
    <CustomAlert open={errorAlert.open} onClose={() => setErrorAlert({ ...errorAlert, open: false })} severity="error" message={errorAlert.message} />
  </div >;
}

export default ViewProfilePage;
