import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


function SendResultsModal({ isOpen, onCancel, onConfirm, empUserId}) {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  };

  const handleConfirm = async () => {
    try {
      // First, send the PATCH request to update 3rd evaluation status
      const evalResponse = await axios.patch(
        `http://localhost:8080/user/${empUserId}/3rdEval`,
        null,
        {
          params: {
            status: true,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (evalResponse.status === 200) {
        // After successful evaluation status update, update the probeStatus to "5th Probationary"
        const statusResponse = await axios.patch(
          `http://localhost:8080/user/${empUserId}/promote`,
          null, // backend logic already gi implement
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (statusResponse.status === 200) {
          onConfirm(); 
        } else {
          console.error("Failed to update the probeStatus.");
        }
      } else {
        console.error("Failed to update the evaluation status.");
      }
    } catch (error) {
      console.error("Error during the update process:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      
      <Box sx={modalStyle}>
        <Typography id="modal-title" sx={{ fontSize: "15px", fontFamily:"Poppins", }} component="h2">
        This action will formally send the results of the employee's evaluation to the Office Head.
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: "30px",
          }}
        >
           <Button
            variant="outlined"
            sx={{
              width: "20%",
              textTransform:"none",
              marginRight: "10px",
              border: "none",
              color: "#8C383E",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#ececeb",
                color: "#8C383E",
                border: "none",
              },
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            sx={{
              width: "20%",
              height: "35px",
              textTransform:"none",
              backgroundColor: "#8C383E",
              "&:hover": {
                backgroundColor: "#7C2828",
              },
            }}
            variant="contained"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
         
        </div>
      </Box>
    </Modal>
  );
}

export default SendResultsModal ;
