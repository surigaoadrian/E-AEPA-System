import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, Menu, Modal } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";
import axios from "axios";

import Fade from "@mui/material/Fade";
import EvaluationForm from "../components/EvaluationForm";

function EvaluateEmployee() {
  const userID = sessionStorage.getItem("userID");
  const [user, setUser] = useState({});
  const [rows, setRows] = useState([]);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
        "http://localhost:8080/evaluation/createEvaluation",
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
        "http://localhost:8080/evaluation/isEvaluationCompletedHead",
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
          `http://localhost:8080/user/getUser/${userID}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch all users
        const allUsersResponse = await fetch(
          "http://localhost:8080/user/getAllUser"
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
          }));

        setRows(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userID, updateFetch]);

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
      label: "Evaluation Period",
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
                fontSize: ".9em",
                "&:hover": { color: "red" },
              }}
              onClick={(event) => handleClick(event, row)}
              style={{ textTransform: "none" }}
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
          ml={4}
          mt={3}
          sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}
        >
          {openForm ? "Evaluation" : "List of Staff"}{" "}
        </Typography>

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
              "& > :not(style)": { ml: 4, mt: 2, width: "95%" },
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
              <Paper
                elevation={1}
                sx={{
                  borderRadius: "5px",
                  width: "100%",
                  height: "32em",
                  backgroundColor: "transparent",
                  mt: ".2%",
                }}
              >
                <TableContainer
                  sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%" }}
                >
                  <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead sx={{ height: "2em" }}>
                      <TableRow>
                        {columnsEmployees.map((column) => (
                          <TableCell
                            sx={{
                              fontFamily: "Poppins",
                              bgcolor: "#8c383e",
                              color: "white",
                              fontWeight: "bold",
                              maxWidth: "2em",
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
                    <TableBody>
                      {rows.map((row) => (
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
                              sx={{ fontFamily: "Poppins" }}
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
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Box>
        )}
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
