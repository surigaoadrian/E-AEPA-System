import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function ConfirmationModal({ isOpen, onConfirm, onCancel }) {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" sx={{ fontSize: "18px" }} component="h2">
          Are you sure you want to submit your responses? This action cannot be
          undone.
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Button
            sx={{
              marginRight: "10px",
              width: "25%",
              height: "35px",
              backgroundColor: "#8C383E",
              "&:hover": {
                backgroundColor: "#7C2828",
              },
              fontFamily: "poppins",
            }}
            variant="contained"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: "20%",
              fontWeight: "bold",
              border: "none",
              color: "#8C383E",
              "&:hover": {
                backgroundColor: "#a4b0be",
                color: "white",
                border: "none",
              },
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default ConfirmationModal;
