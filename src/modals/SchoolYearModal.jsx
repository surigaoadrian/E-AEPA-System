import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { apiUrl } from "../config/config";
import CurrentSchoolYear from "../components/CurrentSchoolYear";
import ViewSchoolYears from "../components/ViewSchoolYears";
import AddNewSchoolYear from "../components/AddNewSchoolYear";

function SchoolYearModal({
  openModal,
  handleCloseModal,
  isOpenView,
  handleOpenView,
  handleCloseView,
  openAddSY,
  setOpenAddSY,
  handleOpenAddSY,
  handleCloseAddSY,
  openEditView,
  handleOpenEditView,
  handleCloseEditView,
}) {
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
  const [currentSem, setCurrentSem] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  const formattedDate = `${day}/${month}/${year}`;

  // useEffect(() => {
  //   const fetchSchoolYearAndSem = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}academicYear/current-year`);
  //       const response2 = await axios.get(
  //         `${apiUrl}academicYear/current-semester`
  //       );
  //       setCurrentSchoolYear(response.data);
  //       setCurrentSem(response2.data);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else {
  //         console.log(`Error: ${error.message}`);
  //       }
  //     }
  //   };

  //   fetchSchoolYearAndSem();
  // }, []);

  const fetchSchoolYearAndSem = async () => {
    try {
      const response = await axios.get(`${apiUrl}academicYear/current-year`);
      const response2 = await axios.get(
        `${apiUrl}academicYear/current-semester`
      );
      setCurrentSchoolYear(response.data);
      setCurrentSem(response2.data);
    } catch (error) {
      console.error("Error fetching current school year and semester:", error);
    }
  };

  // Fetch current school year and semester whenever 'refresh' changes
  useEffect(() => {
    fetchSchoolYearAndSem();
  }, [refresh]);
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableAutoFocus
      disableEnforceFocus
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: openAddSY || openEditView ? "420px" : "330px", //420 for add, 350 for view and current
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
        <div style={{ height: "100%" }}>
          <div style={{ height: "80%" }}>
            {isOpenView ? (
              <ViewSchoolYears
                handleOpenView={handleOpenView}
                handleCloseView={handleCloseView}
                handleOpenEditView={handleOpenEditView}
                handleCloseEditView={handleCloseEditView}
                openEditView={openEditView}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            ) : openAddSY ? (
              <AddNewSchoolYear
                setOpenAddSY={setOpenAddSY}
                handleCloseAddSY={handleCloseAddSY}
                setRefresh={setRefresh}
              />
            ) : (
              <CurrentSchoolYear
                formattedDate={formattedDate}
                currentSchoolYear={currentSchoolYear}
                currentSem={currentSem}
              />
            )}
          </div>
          {isOpenView || openAddSY ? null : (
            <div
              style={{
                height: "20%",
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleOpenView}
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
                View
              </Button>
              <Button
                onClick={handleOpenAddSY}
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
                Add
              </Button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default SchoolYearModal;
