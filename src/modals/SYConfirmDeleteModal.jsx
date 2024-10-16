import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import React from "react";
import axios from "axios";
import { apiUrl } from "../config/config";

function SYConfirmDeleteModal({
  selectedYear,
  openDeleteModal,
  handleCloseDeleteModal,
  setSelectedYear,
  setOpenDeleteModal,
  fetchAcademicYears,
}) {
  if (!selectedYear) {
    return null; // Early return if selectedYear is not defined
  }

  const handleDeleteSY = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}academicYear/delete-year/${selectedYear.id}`
      );
      console.log("School Year Deleted Successfully", response.data);
      await fetchAcademicYears();
      setSelectedYear("");
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Adding School Year failed", error);
    }
  };

  return (
    <Modal
      open={openDeleteModal}
      onClose={handleCloseDeleteModal}
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
          width: 600,
          height: 150,
          backgroundColor: "white",
          boxShadow: 24,
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
          {`Are You sure you want to delete S.Y. ${selectedYear.academicYear}?`}
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
            onClick={handleDeleteSY}
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
            Yes
          </Button>
          <Button
            onClick={handleCloseDeleteModal}
            sx={{
              width: "20%",
              backgroundColor: "#8C383E",
              "&:hover": {
                backgroundColor: "#7C2828",
              },
              fontFamily: "poppins",
            }}
            variant="contained"
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default SYConfirmDeleteModal;
