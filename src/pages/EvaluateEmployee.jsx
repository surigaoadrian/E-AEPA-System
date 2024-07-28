import React, { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, Menu, Modal, TextField, InputAdornment, IconButton, Select, FormControl, ListItemIcon, ListItemText } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faSearch } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";
import axios from "axios";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Fade from "@mui/material/Fade";
import EvaluationForm from "../components/EvaluationForm";
import CheckIcon from '@mui/icons-material/Check';
import { set } from "date-fns";
import { apiUrl } from '../config/config';

function EvaluateEmployee() {
  const userID = sessionStorage.getItem("userID");
  const [user, setUser] = useState({});
  const [rows, setRows] = useState([]);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this based on your needs
  const pagesPerGroup = 5;
  const [searchTerm, setSearchTerm] = useState('');
  // Add state for probeStatus filter
  const [probeStatusFilter, setProbeStatusFilter] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const openFilterMenu = Boolean(filterAnchorEl);
  //adi changes
  const [selectedEmp, setSelectedEmp] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [stage, setStage] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [isEvaluationCompleted, setIsEvaluationCompleted] = useState(false);
  const evalType = "HEAD";

  const [isEvaluationCompletedValues, setIsEvaluationCompletedValues] =
    useState(false);
  const [isEvaluationCompletedJob, setIsEvaluationCompletedJob] =
    useState(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderTop: "30px solid #8C383E",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  const handleOpenModal = (stage, period) => {
    setSelectedStage(stage);
    setOpenModal(true);
    setPeriod(period);
    console.log(selectedEmp.userID);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAnchorEl(null);
  };

  const handleConfirm = async () => {
    setOpenForm(!openForm);
    setStage(selectedStage);
    setOpenModal(false);
    setAnchorEl(null);

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();

    const currentDate = `${year}-${month}-${day}`;

    const evaluation = {
      user: {
        userID: userID,
      },
      peer: {
        userID: selectedEmp.userID,
      },
      stage: selectedStage,
      period: period,
      evalType: evalType,
      status: "OPEN",
      dateTaken: currentDate,
      isDeleted: 0,
    };

    console.log("Evaluation object to be sent:", evaluation);

    try {
      const response = await axios.post(
        `${apiUrl}evaluation/createEvaluation`,
        evaluation
      );

      const evalPeriod = getEvaluationPeriod(selectedEmp.probeStatus);
      await handleCompleteStatus(
        userID,
        selectedEmp.userID,
        evalPeriod,
        "VALUES",
        "HEAD"
      );
      await handleCompleteStatus(
        userID,
        selectedEmp.userID,
        evalPeriod,
        "JOB",
        "HEAD"
      );
    } catch (error) {
      console.error("Creating evaluation failed", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }
  };

  const handleClick = (event, selectedUser) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmp(selectedUser);
    //console.log(selectedEmp);

    setIsEvaluationCompletedValues(false);
    setIsEvaluationCompletedJob(false);

    const period = getEvaluationPeriod(selectedUser.probeStatus);
    handleCompleteStatus(userID, selectedUser.userID, period, "VALUES", "HEAD");
    handleCompleteStatus(userID, selectedUser.userID, period, "JOB", "HEAD");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getEvaluationPeriod = (probeStatus) => {
    if (probeStatus === "3rd Probationary") return "3rd Month";
    if (probeStatus === "5th Probationary") return "5th Month";
    return "Annual";
  };

  useEffect(() => {
    const period = getEvaluationPeriod(selectedEmp.probeStatus);
    if (selectedEmp.userID) {
      handleCompleteStatus(
        userID,
        selectedEmp.userID,
        period,
        "VALUES",
        "HEAD"
      );
      handleCompleteStatus(userID, selectedEmp.userID, period, "JOB", "HEAD");
    }
  }, [selectedEmp]);

  //fetch if eval is done
  const handleCompleteStatus = async (
    userID,
    empID,
    period,
    stage,
    evalType
  ) => {
    try {
      const response = await axios.get(
        `${apiUrl}evaluation/isEvaluationCompletedHead`,
        {
          params: {
            userID: userID,
            empID: empID,
            period: period,
            stage: stage,
            evalType: evalType,
          },
        }
      );
      if (stage === "VALUES") {
        setIsEvaluationCompletedValues(response.data);
      } else if (stage === "JOB") {
        setIsEvaluationCompletedJob(response.data);
      }
    } catch (error) {
      console.error("Error checking evaluation status:", error);
    }
  };

  //fetch the user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch specific user data based on userID
        const userResponse = await fetch(
          `${apiUrl}user/getUser/${userID}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch all users
        const allUsersResponse = await fetch(
          `${apiUrl}user/getAllUser`
        );
        if (!allUsersResponse.ok) {
          throw new Error("Failed to fetch all users data");
        }
        const allUsersData = await allUsersResponse.json();
        const processedData = allUsersData
          .filter(
            (item) => item.role === "EMPLOYEE" && item.dept === userData.dept
          )
          .map((item) => ({
            ...item,
            name: `${item.fName} ${item.lName}`,
            userID: item.userID,
          }))

          .filter((item) => {
            if (probeStatusFilter === '') {
              return true;
            }
            if (probeStatusFilter === 'Annually' && item.probeStatus === '') {
              return true;
            }
            return item.probeStatus === probeStatusFilter;
          });
        // Apply search filter
        const searchFilteredData = processedData.filter((item) =>
          Object.values(item).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        setRows(searchFilteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userID, updateFetch, searchTerm, probeStatusFilter]);


  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const startPageGroup = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPageGroup = Math.min(startPageGroup + pagesPerGroup - 1, totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [currentPage, rows]);

  const hasData = rows.length > 0;

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleMenuClick = (value) => {
    setProbeStatusFilter(value);
    handleCloseFilter();
  };

  const columnsEmployees = [
    {
      id: "workID",
      label: "ID Number",
      align: "center",
      minWidth: 150,
    },
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
      format: (value) => formatName(value),
    },

    {
      id: "position",
      label: "Position",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },
    {
      id: "probeStatus",
      label: (
        <div style={{ display: 'flex', alignItems: 'center', }}>
          <span>Evaluation Period</span>
          <IconButton
            onClick={handleFilterClick}
            sx={{ color: 'white', width: '1.3em', height: '1.3em', ml: '.6vh' }}
          >
            <FilterAltIcon fontSize="medium" />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleCloseFilter}
            PaperProps={{
              sx: {
                '& .MuiMenuItem-root': {
                  fontSize: '.7em',
                  fontFamily: 'Poppins',
                },
              },
            }}
          >
            <MenuItem
            dense
              onClick={() => handleMenuClick('')}
              selected={probeStatusFilter === ''}
              sx={{ fontFamily: 'Poppins' }}
            >
              <ListItemIcon>{probeStatusFilter === '' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText  primary="All" style={{ fontFamily: 'Poppins',fontSize:'.5em',  }} />
            </MenuItem>
            <MenuItem
            dense
              onClick={() => handleMenuClick('Annually')}
              selected={probeStatusFilter === 'Annually'}
              sx={{ fontFamily: 'Poppins',fontSize:'.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === 'Annually' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="Annually" sx={{ fontFamily: 'Poppins',fontSize:'.5em' }} />
            </MenuItem>
            <MenuItem
            dense
              onClick={() => handleMenuClick('3rd Probationary')}
              selected={probeStatusFilter === '3rd Probationary'}
              sx={{ fontFamily: 'Poppins',fontSize:'.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === '3rd Probationary' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="3rd Probationary" sx={{ fontFamily: 'Poppins',fontSize:'.5em' }} />
            </MenuItem>
            <MenuItem
            dense
              onClick={() => handleMenuClick('5th Probationary')}
              selected={probeStatusFilter === '5th Probationary'}
              style={{ fontFamily: 'Poppins',fontSize:'.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === '5th Probationary' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="5th Probationary" sx={{ fontFamily: 'Poppins',fontSize:'.5em' }} />
            </MenuItem>
          </Menu>

        </div>
      ),
      minWidth: 150,
      align: "center",
      format: (value) => {
        if (value === "") {
          return "Annually";
        } else {
          return value.toLocaleString("en-US");
        }
      },
    },

    {
      id: "actions",
      label: "Action",
      minWidth: 150,
      align: "center",
      format: (value, row) => {
        return (
          <div>
            <Button
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: "#8c383e",
                fontSize: ".87em",
                "&:hover": { color: "red" },
              }}
              onClick={(event) => handleClick(event, row)}
              style={{ textTransform: "none", fontFamily: 'Poppins' }}
              startIcon={
                <FontAwesomeIcon
                  icon={faFileLines}
                  style={{ fontSize: ".8rem" }}
                />
              }
            >
              Evaluate
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 0, // Remove shadow
                sx: {
                  border: '1px solid #d3d4d5',
                  boxShadow: 'none', // Remove shadow
                  '& .MuiMenuItem-root': {
                    fontSize: '.8em',
                    fontFamily: 'Poppins',
                  },
                },
              }}
            >
              <MenuItem
                disabled={isEvaluationCompletedValues}
                sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                onClick={() =>
                  handleOpenModal(
                    "VALUES",
                    getEvaluationPeriod(selectedEmp.probeStatus)
                  )
                }
              >
                Stage 1: H-VBPA{" "}
              </MenuItem>{" "}
              {/* igka click mo gawas ang evaluation  */}
              <MenuItem
                disabled={isEvaluationCompletedJob}
                sx={{ fontSize: ".8em", fontFamily: "Poppins" }}
                onClick={() =>
                  handleOpenModal(
                    "JOB",
                    getEvaluationPeriod(selectedEmp.probeStatus)
                  )
                }
              >
                Stage 2: H-JBPA{" "}
              </MenuItem>
              {/* {" "} */}
              {/* so disabled siya if wa pa nahoman ang stage 1, din if mana sd si stage 1 dapat mo disable si 1  */}
            </Menu>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Animated>
        <Typography
          ml={6.5}
          mt={3}
          sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}
        >
          {openForm ? "Evaluation" : "List of Staff"}{" "}
        </Typography>
        <div className="ml-8 mt-2">
          <div className="mr-10  flex items-center justify-between">
            <div className="ml-4 flex items-center justify-start">
              <TextField
                placeholder="Search ..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{

                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff", // Set the background color for the entire input area
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "1px",
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#e0e0e0",
                  },
                  "&:focus-within": {
                    "& fieldset": {
                      borderColor: "#8C383E !important",
                      borderWidth: "1px !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "10px 10px",
                    fontSize: "13px",
                    fontFamily: "Poppins",
                  },
                  minWidth: "110%",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment>
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{ fontSize: "13px", padding: "0" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
        {/** Diri ko mag conditional rendering */}
        {openForm ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": { ml: 4, mt: 2, mr: 4, width: "93.5%" },
            }}
          >
            <EvaluationForm
              period={period}
              loggedUser={user}
              selectedEmp={selectedEmp}
              stage={stage}
              evalType={evalType}
              setOpenForm={setOpenForm}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": { ml: 6, mt: 2, width: "93%" },
            }}
          >
            <Grid
              container
              spacing={1.5}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >

              <TableContainer
                sx={{height:'30.68em', borderRadius: "5px 5px 0 0 ", maxHeight: "100%", border: '1px solid lightgray' }}
              >
                <Table stickyHeader aria-label="a dense table" size="small">
                  <TableHead sx={{ height: "2em" }}>
                    <TableRow>
                      {columnsEmployees.map((column) => (
                        <TableCell
                          component="th" scope="row"
                          sx={{
                            fontFamily: "Poppins",
                            bgcolor: "#8c383e",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {hasData ? (
                    <TableBody>
                      {paginatedRows.map((row) => (
                        <TableRow
                          sx={{
                           
                            bgcolor: "white",
                            "&:hover": {
                              backgroundColor: "rgba(248, 199, 2, 0.5)",
                              color: "black",
                            },
                          }}
                          key={row.id}
                        >
                          {columnsEmployees.map((column) => (
                            <TableCell
                              component="th" scope="row"
                              sx={{ fontFamily: "Poppins", fontSize: '.8em' }}
                              key={`${row.id}-${column.id}`}
                              align={column.align}
                            >
                              {column.id === "name"
                                ? row.name
                                : column.id === "actions"
                                  ? column.format
                                    ? column.format(row[column.id], row)
                                    : null
                                  : column.format
                                    ? column.format(row[column.id])
                                    : row[column.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ bgcolor: 'white', height: '28.25em', borderRadius: '0 0 5px 5px' }} colSpan={columnsEmployees.length} align="center">
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "17px",
                              color: "#1e1e1e",
                              fontWeight: 500,
                              padding: "25px",
                            }}
                          >
                            There are currently no data in this table</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}

                </Table>
              </TableContainer>
            </Grid>
          </Box>
        )}
        {/* Pagination */}
        < div
          className="rounded-b-lg mt-2 border-gray-200 px-4 py-2 ml-9"
          style={{
            position: "relative", // Change to relative to keep it in place
            // bottom: 45,
            // left: '21.5%',
            // transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            // ml: '4em'
          }}
        >
          <ol className="flex justify-end gap-1 text-xs font-medium">
            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handlePrevPage}
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>

            {Array.from({ length: endPageGroup - startPageGroup + 1 }, (_, index) => (
              <li key={startPageGroup + index}>
                <a
                  href="#"
                  className={`block h-8 w-8 rounded border ${currentPage === startPageGroup + index
                    ? "border-pink-900 bg-pink-900 text-white"
                    : "border-gray-100 bg-white text-gray-900"
                    } text-center leading-8`}
                  onClick={() => handlePageChange(startPageGroup + index)}
                >
                  {startPageGroup + index}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handleNextPage}
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ol>
        </div>
      </Animated>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" sx={{ fontSize: "16px" }} component="h2">
            Are you sure you want to start the assessment now?
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
                width: "20%",
                height: "35px",
                backgroundColor: "#8C383E",
                "&:hover": {
                  backgroundColor: "#7C2828",
                },
                fontFamily: "poppins",
              }}
              variant="contained"
              onClick={handleConfirm}
            >
              YES
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
              onClick={handleCloseModal}
            >
              NO
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default EvaluateEmployee;
