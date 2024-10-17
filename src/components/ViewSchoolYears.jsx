import axios from "axios";
import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from "../config/config";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material";
import SYConfirmDeleteModal from "../modals/SYConfirmDeleteModal";
import Switch from "@mui/material/Switch";
// Add this import to use the format function
import { format } from "date-fns";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // Border color when focused
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "black", // Label text color when focused
          },
        },
      },
    },
  },
});

function ViewSchoolYears({
  handleOpenView,
  handleCloseView,
  handleOpenEditView,
  handleCloseEditView,
  openEditView,
  refresh,
  setRefresh,
}) {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const currentDate = new Date();

  //const [refresh, setRefresh] = useState(false);

  // Edit state
  const [academicYearStartDate, setAcademicYearStartDate] = useState(null);
  const [academicYearEndDate, setAcademicYearEndDate] = useState(null);
  const [firstSemesterStartDate, setFirstSemesterStartDate] = useState(null);
  const [firstSemesterEndDate, setFirstSemesterEndDate] = useState(null);
  const [secondSemesterStartDate, setSecondSemesterStartDate] = useState(null);
  const [secondSemesterEndDate, setSecondSemesterEndDate] = useState(null);

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(`${apiUrl}academicYear/all-years`);
      setAcademicYears(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }
  };

  // Get all academic years
  useEffect(() => {
    fetchAcademicYears();
  }, [refresh]);

  const handleYearChange = (event) => {
    const year = academicYears.find(
      (y) => y.academicYear === event.target.value
    );
    setSelectedYear(year);

    // Populate the form with selected year values when editing
    if (year) {
      setAcademicYearStartDate(new Date(year.startDate));
      setAcademicYearEndDate(new Date(year.endDate));

      const [firstSemester, secondSemester] = year.semesters;
      setFirstSemesterStartDate(new Date(firstSemester.startDate));
      setFirstSemesterEndDate(new Date(firstSemester.endDate));
      setSecondSemesterStartDate(new Date(secondSemester.startDate));
      setSecondSemesterEndDate(new Date(secondSemester.endDate));
    }

    if (year && year.semesters.length >= 2) {
      const firstSemesterId = year.semesters[0].id;
      const secondSemesterId = year.semesters[1].id;

      // You can now use these IDs to edit the semesters
      console.log("First Semester ID:", firstSemesterId);
      console.log("Second Semester ID:", secondSemesterId);
    }
  };

  //save
  const handleSave = async () => {
    const firstSemesterId = selectedYear.semesters[0].id;
    const secondSemesterId = selectedYear.semesters[1].id;

    try {
      //edit academic year
      const academicYearResponse = await axios.put(
        `${apiUrl}academicYear/edit-year/${selectedYear.id}`,
        null,
        {
          params: {
            startDate: format(academicYearStartDate, "yyyy-MM-dd"),
            endDate: format(academicYearEndDate, "yyyy-MM-dd"),
          },
        }
      );
      console.log(
        "Academic Year updated successfully:",
        academicYearResponse.data
      );

      //edit first semester
      const firstSemesterResponse = await axios.put(
        `${apiUrl}academicYear/edit-semester/${firstSemesterId}`,
        null,
        {
          params: {
            startDate: format(firstSemesterStartDate, "yyyy-MM-dd"),
            endDate: format(firstSemesterEndDate, "yyyy-MM-dd"),
          },
        }
      );
      console.log(
        "First Semester updated successfully:",
        firstSemesterResponse.data
      );

      //edit second semester
      const secondSemesterResponse = await axios.put(
        `${apiUrl}academicYear/edit-semester/${secondSemesterId}`,
        null,
        {
          params: {
            startDate: format(secondSemesterStartDate, "yyyy-MM-dd"),
            endDate: format(secondSemesterEndDate, "yyyy-MM-dd"),
          },
        }
      );
      console.log(
        "Second Semester updated successfully:",
        secondSemesterResponse.data
      );

      setSelectedYear("");

      // Close the edit view after successful save
      handleCloseEditView();
    } catch (error) {
      console.error("Error updating academic year or semesters:", error);
    }
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  // Handle switching the active year
  const handleSwitchChange = async (yearId, isActive) => {
    // Optimistically update the UI by marking the selected year as active and others as inactive
    setSelectedYear((prevSelectedYear) => ({
      ...prevSelectedYear,
      isActive: !isActive,
    }));

    setAcademicYears((prevYears) =>
      prevYears.map((year) =>
        year.id === yearId
          ? { ...year, isActive: !isActive }
          : { ...year, isActive: false }
      )
    );

    // try {
    //   if (!isActive) {
    //     // Activate this year and deactivate others
    //     await axios.put(`${apiUrl}academicYear/set-active/${yearId}`);
    //   }
    // } catch (error) {
    //   console.error("Error setting active year:", error);
    //   // If an error occurs, fetch the years again to undo optimistic update
    //   fetchAcademicYears();
    // }
    try {
      if (isActive) {
        // If the year is currently active, deactivate it
        await axios.put(`${apiUrl}academicYear/set-inactive/${yearId}`);
      } else {
        // Activate this year and deactivate others
        await axios.put(`${apiUrl}academicYear/set-active/${yearId}`);
      }
      fetchAcademicYears(); // Refresh the list after toggling
      setRefresh((prev) => !prev); // Trigger a refresh to update CurrentSchoolYear
    } catch (error) {
      console.error("Error toggling active/inactive year:", error);
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
      {/* Academic Year Selection */}
      {!openEditView && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemeProvider theme={theme}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="academic-year-select-label">
                Academic Year
              </InputLabel>
              <Select
                labelId="academic-year-select-label"
                id="academic-year-select"
                value={selectedYear?.academicYear || ""}
                label="Academic Year"
                onChange={handleYearChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.academicYear}>
                    {year.academicYear} {year.isActive ? "(active)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ThemeProvider>

          {selectedYear && (
            <div style={{ display: "flex" }}>
              {/* {selectedYear.isActive ? (
                <div
                  style={{
                    fontSize: "13px",
                    color: "white",
                    height: "25px",
                    width: "75px",
                    backgroundColor: "#27ae60",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                  }}
                >
                  <p>Active</p>
                </div>
              ) : null} */}
              <div
                key={selectedYear.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  //padding: "10px",
                  fontSize: "15px",
                }}
              >
                <span>{selectedYear.isActive ? "Active" : "Inactive"}</span>

                {/* MUI Switch for activating/deactivating the academic year */}
                <Switch
                  checked={selectedYear?.isActive || false}
                  onChange={() =>
                    handleSwitchChange(selectedYear?.id, selectedYear?.isActive)
                  }
                  disabled={
                    selectedYear.endDate &&
                    new Date(selectedYear.endDate) < currentDate
                  }
                  inputProps={{ "aria-label": "controlled" }}
                  //color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#F8C702", // Active thumb color
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#F8C702", // Active track color
                    },
                  }}
                />
              </div>

              <Button onClick={handleOpenDeleteModal}>
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ fontSize: "16px", color: "#808080" }}
                />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Display Academic Year Details or Edit Form */}
      {!selectedYear ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            paddingTop: "10px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              width: "100%",
              marginBottom: "10px",
              color: "#636E72",
            }}
            fontSize={15}
            gutterBottom
            fontFamily="Poppins"
          >
            No selected Academic Year as of the moment.
          </Typography>
        </div>
      ) : openEditView ? (
        // Edit Form
        <div
          style={{
            height: "450px",
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
              Edit Academic Year
            </Typography>

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
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={academicYearEndDate}
                onChange={(newValue) => setAcademicYearEndDate(newValue)}
                minDate={academicYearStartDate}
                renderInput={(params) => <TextField {...params} />}
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
            <div style={{ width: "100%", display: "flex", gap: "30px" }}>
              <DatePicker
                label="Start Date"
                value={firstSemesterStartDate}
                onChange={(newValue) => setFirstSemesterStartDate(newValue)}
                minDate={academicYearStartDate}
                maxDate={academicYearEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={firstSemesterEndDate}
                onChange={(newValue) => setFirstSemesterEndDate(newValue)}
                minDate={firstSemesterStartDate}
                maxDate={academicYearEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            {/* Second Semester Start and End Date */}
            <Typography
              sx={{
                fontWeight: 600,
                width: "100%",
                marginBottom: "10px",
                color: "#1E1E1E",
              }}
              fontSize={15}
            >
              Second Semester
            </Typography>
            <div style={{ width: "100%", display: "flex", gap: "30px" }}>
              <DatePicker
                label="Start Date"
                value={secondSemesterStartDate}
                onChange={(newValue) => setSecondSemesterStartDate(newValue)}
                minDate={firstSemesterEndDate}
                maxDate={academicYearEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={secondSemesterEndDate}
                onChange={(newValue) => setSecondSemesterEndDate(newValue)}
                minDate={secondSemesterStartDate}
                maxDate={academicYearEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </LocalizationProvider>
        </div>
      ) : (
        // Display Academic Year Details
        <div style={{ display: "flex", width: "100%", paddingTop: "10px" }}>
          {selectedYear.semesters.map((semester) => (
            <div style={{ width: "50%" }} key={semester.id}>
              <Typography
                sx={{ fontWeight: 600, width: "100%", marginBottom: "10px" }}
                fontSize={15}
              >
                {semester.name}
              </Typography>
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ fontWeight: 500, width: "50%" }}
                  fontSize={15}
                >
                  Start Date:
                </Typography>
                <Typography
                  sx={{ fontWeight: 500, width: "50%" }}
                  fontSize={15}
                >
                  {semester.startDate}
                </Typography>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  sx={{ fontWeight: 500, width: "50%" }}
                  fontSize={15}
                >
                  End Date:
                </Typography>
                <Typography
                  sx={{ fontWeight: 500, width: "50%" }}
                  fontSize={15}
                >
                  {semester.endDate}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          height: "20%",
          width: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: openEditView ? "20px" : "0px",
        }}
      >
        {selectedYear &&
          (openEditView ? (
            <Button
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
              onClick={handleSave}
            >
              Save
            </Button>
          ) : (
            <Button
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
              onClick={handleOpenEditView}
            >
              Edit
            </Button>
          ))}
        <Button
          onClick={handleCloseView}
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
          Back
        </Button>
      </div>

      {/* Delete Modal */}
      <SYConfirmDeleteModal
        selectedYear={selectedYear}
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        setSelectedYear={setSelectedYear}
        fetchAcademicYears={fetchAcademicYears}
      />
    </div>
  );
}

export default ViewSchoolYears;
