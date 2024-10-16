import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { apiUrl } from "../config/config";
import { format } from "date-fns";

function AddNewSchoolYear({ setOpenAddSY, handleCloseAddSY, setRefresh }) {
  const [academicYearStartDate, setAcademicYearStartDate] = useState(null);
  const [academicYearEndDate, setAcademicYearEndDate] = useState(null);
  const [firstSemesterStartDate, setFirstSemesterStartDate] = useState(null);
  const [firstSemesterEndDate, setFirstSemesterEndDate] = useState(null);
  const [secondSemesterStartDate, setSecondSemesterStartDate] = useState(null);
  const [secondSemesterEndDate, setSecondSemesterEndDate] = useState(null);

  const [errors, setErrors] = useState({});

  const handleAddSchoolYear = async () => {
    const newErrors = {};
    let missingFields = [];

    if (!academicYearStartDate) {
      newErrors.academicYearStartDate = "Start Date is required";
      missingFields.push("Academic Year Start Date");
    }
    if (!academicYearEndDate) {
      newErrors.academicYearEndDate = "End Date is required";
      missingFields.push("Academic Year End Date");
    }
    if (!firstSemesterStartDate) {
      newErrors.firstSemesterStartDate = "Start Date is required";
      missingFields.push("First Semester Start Date");
    }
    if (!firstSemesterEndDate) {
      newErrors.firstSemesterEndDate = "End Date is required";
      missingFields.push("First Semester End Date");
    }
    if (!secondSemesterStartDate) {
      newErrors.secondSemesterStartDate = "Start Date is required";
      missingFields.push("Second Semester Start Date");
    }
    if (!secondSemesterEndDate) {
      newErrors.secondSemesterEndDate = "End Date is required";
      missingFields.push("Second Semester End Date");
    }

    if (missingFields.length > 0) {
      setErrors(newErrors);
      alert(
        `Please fill out the following fields:\n${missingFields.join("\n")}`
      );
      return; // Prevent submission if there are errors
    }

    try {
      const response = await axios.post(
        `${apiUrl}academicYear/create-year`,
        null,
        {
          params: {
            academicYearStartDate: format(academicYearStartDate, "yyyy-MM-dd"),
            academicYearEndDate: format(academicYearEndDate, "yyyy-MM-dd"),
            firstSemesterStartDate: format(
              firstSemesterStartDate,
              "yyyy-MM-dd"
            ),
            firstSemesterEndDate: format(firstSemesterEndDate, "yyyy-MM-dd"),
            secondSemesterStartDate: format(
              secondSemesterStartDate,
              "yyyy-MM-dd"
            ),
            secondSemesterEndDate: format(secondSemesterEndDate, "yyyy-MM-dd"),
          },
        }
      );
      console.log("School Year Added Successfully", response.data);

      // Trigger the refresh to update other components
      setRefresh((prev) => !prev);

      // Close the component after successful addition
      setOpenAddSY(false);
    } catch (error) {
      console.error("Adding School Year failed", error);
    }
  };

  return (
    <div
      style={{
        height: "125%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography
          sx={{
            fontWeight: 600,
            width: "100%",
            marginBottom: "10px",
            color: "#1E1E1E",
          }}
          fontSize={15}
        >
          Add New Academic Year
        </Typography>

        {/* Academic Year Start and End Date */}
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "30px",
            marginBottom: "10px",
          }}
        >
          <DatePicker
            label="Start Date"
            value={academicYearStartDate}
            onChange={(newValue) => setAcademicYearStartDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.academicYearStartDate}
                helperText={errors.academicYearStartDate}
              />
            )}
          />

          <DatePicker
            label="End Date"
            value={academicYearEndDate}
            onChange={(newValue) => setAcademicYearEndDate(newValue)}
            minDate={academicYearStartDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.academicYearEndDate}
                helperText={errors.academicYearEndDate}
              />
            )}
          />
        </div>

        {/* First Semester Start and End Date */}
        <Typography
          sx={{
            fontWeight: 600,
            width: "100%",
            marginBottom: "10px",
            color: "#1E1E1E",
          }}
          fontSize={15}
        >
          First Semester
        </Typography>
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "30px",
          }}
        >
          <DatePicker
            label="Start Date"
            value={firstSemesterStartDate}
            onChange={(newValue) => setFirstSemesterStartDate(newValue)}
            minDate={academicYearStartDate}
            maxDate={academicYearEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.firstSemesterStartDate}
                helperText={errors.firstSemesterStartDate}
              />
            )}
          />

          <DatePicker
            label="End Date"
            value={firstSemesterEndDate}
            onChange={(newValue) => setFirstSemesterEndDate(newValue)}
            minDate={firstSemesterStartDate || academicYearStartDate}
            maxDate={academicYearEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.firstSemesterEndDate}
                helperText={errors.firstSemesterEndDate}
              />
            )}
          />
        </div>

        {/* Second Semester Start and End Date */}
        <Typography
          sx={{
            fontWeight: 600,
            width: "100%",
            margin: "10px 0px 10px 0px",
            color: "#1E1E1E",
          }}
          fontSize={15}
        >
          Second Semester
        </Typography>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "30px",
          }}
        >
          <DatePicker
            label="Start Date"
            value={secondSemesterStartDate}
            onChange={(newValue) => setSecondSemesterStartDate(newValue)}
            minDate={firstSemesterEndDate || academicYearStartDate}
            maxDate={academicYearEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.secondSemesterStartDate}
                helperText={errors.secondSemesterStartDate}
              />
            )}
          />

          <DatePicker
            label="End Date"
            value={secondSemesterEndDate}
            onChange={(newValue) => setSecondSemesterEndDate(newValue)}
            minDate={
              secondSemesterStartDate ||
              firstSemesterEndDate ||
              academicYearStartDate
            }
            maxDate={academicYearEndDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.secondSemesterEndDate}
                helperText={errors.secondSemesterEndDate}
              />
            )}
          />
        </div>
      </LocalizationProvider>

      <div
        style={{
          height: "15%",
          width: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          onClick={handleAddSchoolYear}
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
          Add
        </Button>
        <Button
          onClick={handleCloseAddSY}
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
          Close
        </Button>
      </div>
    </div>
  );
}

export default AddNewSchoolYear;
