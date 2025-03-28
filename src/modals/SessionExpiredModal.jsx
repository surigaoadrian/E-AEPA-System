import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function SessionExpiredModal({ open, handleClose }) {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    handleClose();
    navigate("/login");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableAutoFocus
      disableEnforceFocus
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 150,
          backgroundColor: "white",
          //boxShadow: 24,
          borderTop: "30px solid #8C383E",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <Typography
          sx={{ fontWeight: 500, width: "100%" }}
          fontSize={15}
          gutterBottom
          fontFamily="Poppins"
        >
          {"Your session has expired. Please log in again to continue."}
        </Typography>
        <div
          style={{
            height: "80%",
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
          }}
        >
          <Button
            onClick={handleLoginRedirect}
            sx={{
              width: "20%",
              marginRight: "10px",
              backgroundColor: "#8C383E",
              "&:hover": {
                backgroundColor: "#7C2828",
              },
              fontFamily: "poppins",
            }}
            variant="contained"
          >
            OK
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default SessionExpiredModal;
