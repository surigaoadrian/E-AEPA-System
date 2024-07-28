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
import { apiUrl } from '../config/config';

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function SchoolYearModal({ openModal, handleCloseModal }) {
  const [currentSchoolYear, setCurrentSchoolYear] = useState(null);
  const [firstSemester, setFirstSemester] = useState([]);
  const [secondSemester, setSecondSemester] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "300px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}schoolYear/current`)
      .then((response) => {
        setCurrentSchoolYear(response.data.year);
        const semesters = response.data.semesters;
        setFirstSemester(
          semesters.find((sem) => sem.name === "First Semester").months
        );
        setSecondSemester(
          semesters.find((sem) => sem.name === "Second Semester").months
        );
      })
      .catch((error) =>
        console.error("Error fetching school year data:", error)
      );
  }, []);

  const handleEditSemester = () => {
    setEditMode(true);
  };

  const handleCancelEditSemester = () => {
    setEditMode(false);
  };

  const handleSaveSemester = () => {
    const updatedFirstSemester = {
      id: 1,
      name: "First Semester",
      months: firstSemester,
    };
    const updatedSecondSemester = {
      id: 2,
      name: "Second Semester",
      months: secondSemester,
    };

    axios
      .post(
        `${apiUrl}schoolYear/semester/1`,
        updatedFirstSemester.months
      )
      .then((response) => console.log("First semester updated:", response.data))
      .catch((error) => console.error("Error updating first semester:", error));

    axios
      .post(
        `${apiUrl}schoolYear/semester/2`,
        updatedSecondSemester.months
      )
      .then((response) =>
        console.log("Second semester updated:", response.data)
      )
      .catch((error) =>
        console.error("Error updating second semester:", error)
      );

    setEditMode(false);
  };

  const handleFirstSemesterChange = (e) => {
    const startMonth = e.target.value;
    const startIndex = months.indexOf(startMonth);
    const newFirstSemester = [];
    for (let i = 0; i < 5; i++) {
      newFirstSemester.push(months[(startIndex + i) % 12]);
    }
    setFirstSemester(newFirstSemester);
  };

  const handleSecondSemesterChange = (e) => {
    const startMonth = e.target.value;
    const startIndex = months.indexOf(startMonth);
    const newSecondSemester = [];
    for (let i = 0; i < 5; i++) {
      newSecondSemester.push(months[(startIndex + i) % 12]);
    }
    setSecondSemester(newSecondSemester);
  };

  console.log(currentSchoolYear);
  console.log(firstSemester);
  console.log(secondSemester);

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <div>
          {editMode ? (
            <div>
              {/* <p
                style={{
                  fontSize: "18px",
                  color: "#1E1E1E",
                  fontWeight: 500,
                  marginBottom: "10px",
                }}
              >
                Edit Semesters
              </p> */}
              <p
                style={{
                  color: "#636E72",
                  fontSize: "13px",
                  backgroundColor: "#ecf0f1",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                Instructions: To set new months for the semester, input the
                start month.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div style={{ width: "48%" }}>
                  <FormControl fullWidth>
                    <p style={{ color: "#1e1e1e", marginBottom: "3px" }}>
                      First Semester
                    </p>
                    <Select
                      labelId="first-semester-label"
                      id="first-semester"
                      value={firstSemester[0] || ""}
                      onChange={handleFirstSemesterChange}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={index} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ width: "48%" }}>
                  <FormControl fullWidth>
                    <p style={{ color: "#1e1e1e", marginBottom: "3px" }}>
                      Second Semester
                    </p>
                    <Select
                      labelId="second-semester-label"
                      id="second-semester"
                      value={secondSemester[0] || ""}
                      onChange={handleSecondSemesterChange}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={index} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{
                    marginTop: "40px",
                    marginRight: "8px",
                    width: "20%",
                    height: "35px",
                    backgroundColor: "#8C383E",
                    "&:hover": {
                      backgroundColor: "#7C2828",
                    },
                    fontFamily: "poppins",
                  }}
                  variant="contained"
                  onClick={handleSaveSemester}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: "40px",
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
                  onClick={handleCancelEditSemester}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    flex: "1",
                  }}
                >
                  Current School Year:{" "}
                </p>
                <p
                  style={{
                    width: "55%",
                  }}
                >
                  {currentSchoolYear}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    flex: "1",
                  }}
                >
                  First Semester:{" "}
                </p>
                <p
                  style={{
                    width: "55%",
                  }}
                >
                  {firstSemester.join(", ")}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    flex: "1",
                  }}
                >
                  Second Semester:{" "}
                </p>
                <p
                  style={{
                    width: "55%",
                    height: "50px",
                  }}
                >
                  {secondSemester.join(", ")}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{
                    marginTop: "45px",
                    width: "150px",
                    height: "35px",
                    backgroundColor: "#8C383E",
                    "&:hover": {
                      backgroundColor: "#7C2828",
                    },
                    fontFamily: "poppins",
                  }}
                  variant="contained"
                  onClick={handleEditSemester}
                >
                  Edit Semester
                </Button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default SchoolYearModal;
