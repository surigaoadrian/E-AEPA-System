import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, FormHelperText, Box, IconButton } from '@mui/material';
import axios from 'axios';
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/config';

const PasswordConfirmationModal = ({ open, onClose, onConfirm, loggedUserData }) => {
//   const [loggedUserData, setLoggedUserData] = useState({});
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) setMessage(""); // Clear error message on user input
  };

  const handleClose = () => {   
    navigate('/')
    onClose();
    
    };

  const handleConfirm = async (e) => {
    e.preventDefault();
    
    const username = loggedUserData?.username;
    console.log("Username:", username);
    try {
      const response = await axios.post(`${apiUrl}verifyPassword`, {
        username,
        password,
      });

      if (response.data) {
        onConfirm();
        onClose();
      } else {
        setMessage("Invalid password. Please try again.");
      }
    } catch (error) {
      setMessage("Error verifying password. Please try again.");
    }
  };

  return (
    <Dialog
      maxWidth="xs"
      open={open} 
    >
        <Box
          sx={{
            bgcolor: "#8c383e",
            height: "2em",
            width: "100%",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ "&:hover": { color: "#F8C702" } }}
          >
            <HighlightOffOutlinedIcon
              sx={{ fontSize: "1em", color: "white" }}
            />
          </IconButton>
        </Box>
      <DialogContent >
        <DialogContentText sx={{display:"flex", justifyContent:"center", fontSize:'1.8vh',fontFamily: "Poppins",}}>Please enter your password to access this page</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={handlePasswordChange}
          InputLabelProps={{
            style: { fontFamily: "Poppins", fontSize: "1.8vh" },
          }}
          inputProps={{
            style: { fontSize: "1.8vh", fontFamily: "Poppins" },
          }}
        />
        {message && (
          <FormHelperText style={{ color: 'red', fontFamily:'Poppins' }}>{message}</FormHelperText>
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button 
            type="submit"
            variant="contained"
            sx={{
                bgcolor: "#8C383E",
                height: "2.5em",
                borderRadius: "5px",
                textTransform: "none",
                width: "35%",
                mr: ".5em",
                mb: "1em",
                fontFamily: "Poppins",
                color: "white",
                "&:hover": { bgcolor: "#762F34", color: "white" },
            }}
            onClick={handleConfirm}>Confirm{" "}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordConfirmationModal;
