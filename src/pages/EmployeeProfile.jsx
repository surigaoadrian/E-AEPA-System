import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Box, Grid, Tabs, Tab } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import VerifiedIcon from "@mui/icons-material/Verified";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUsers,
  faPaperPlane,
  faCheck,
  faEye,
  faScroll,
  faGraduationCap,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import Animated from "../components/motion";
import AdminViewResult from "../modals/AdminViewResults";
import Admin5thViewResults from "../modals/Admin5thViewResults";
import AdminAnnual1stResults from "../modals/AdminAnnual1stViewResults";
import AdminAnnual2ndResults from "../modals/AdminAnnual2ndViewResults";
import { apiUrl } from "../config/config";
import ManagePeerModal from "../modals/ManagePeerModal";
import SendResultsModal from "../modals/SendResultsModal";
import Send5thResultsModal from "../modals/Send5thResultsModal";
import SendAnnual1st from "../modals/SendAnnual1stModal";
import SendAnnual2nd from "../modals/SendAnnual2ndModal";
import Loader from "../components/Loader";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#8C383E", // Maroon color
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});

const VerifiedIconWrapper = ({ verified }) => {
  const iconColor = verified ? "green" : "gray";
  return <VerifiedIcon htmlColor={iconColor} style={{ fontSize: 24 }} />;
};

function base64ToDataURL(base64String) {
  return `data:image/png;base64,${base64String}`;
}

function EmployeeProfile({ user, handleBack }) {
  const containerStyle = {
    borderTop: "1px solid transparent",
    marginTop: "30px",
    padding: 0,
  };

  const [loading, setLoading] = useState(true);

  const [selectedYearEvaluation, setSelectedYearEvaluation] = useState(" ");
  const [selectedTab, setSelectedTab] = useState(0);
  const [userData, setUserData] = useState([]);
  const [years, setYears] = useState([]);
  const [show3rd, setShow3rd] = useState(false);
  const [show5th, setShow5th] = useState(false);
  const [selectedEvaluationPeriod, setSelectedEvaluationPeriod] =
    useState("3rd Month");
  const [evaluationsData, setEvaluationsData] = useState([]);
  const [peerData, setPeerData] = useState([]);
  const role = sessionStorage.getItem("userRole");
  const [is3rdModal, setIs3rdModal] = useState(false);
  const [is3rdEvalComplete, setIs3rdEvalComplete] = useState(false);
  const [is5thModalOpen, setIs5thModal] = useState(false);
  const [is5thEvalComplete, setIs5thEvalComplete] = useState(false);
  const [hasAnnualPeriod, setHasAnnualPeriod] = useState(false);
  const [isAnnual1stComplete, setIsAnnual1stComplete] = useState(false);
  const [isAnnual2ndComplete, setIsAnnual2ndComplete] = useState(false);
  const [annual1stModal, setAnnual1stModal] = useState(false);
  const [annual2ndModal, setAnnual2ndModal] = useState(false);
  const [showAnnual1st, setShowAnnual1st] = useState(false);
  const [showAnnual2nd, setShowAnnual2nd] = useState(false);
  const [semester, setSemesters] = useState(" ");
  const [currentAcadYear, setCurrentAcadYear] = useState(null);

  //adi changes
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenPeerModal = () => {
    setOpenModal(true);
  };

  const handleClosPeerModal = () => {
    setOpenModal(false);
  };
  //FETCH ACAD YEAR
  useEffect(() => {
    const fetchCurrentAcadYear = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}academicYear/current-year-full`
        );
        const currentYear = response.data;
        setCurrentAcadYear(currentYear);
      } catch (error) {
        console.error("Failed to fetch academic year:", error);
      }
    };

    fetchCurrentAcadYear();
  }, []);
  console.log("ACAD YEAR ID:", currentAcadYear?.id);

  const [evalStatus, setEvalStatus] = useState([]);

  useEffect(() => {
    const fetchEvalStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}eval-status`, {
          params: {
            userId: userData?.userID,
            academicYearId: currentAcadYear?.id,
          },
        });

        setEvalStatus(response.data);
      } catch (error) {
        console.error(
          "Error fetching and inserting eval status tracker:",
          error
        );
      }
    };

    if (currentAcadYear) {
      fetchEvalStatus();
    }
  }, [userData, currentAcadYear]);
  console.log("USER AYD:", evalStatus);
  console.log("USER ID FETCHED:", userData.userID);
  console.log("STATUS:", isAnnual1stComplete);

  useEffect(() => {
    const assignStatus = () => {
      setIsAnnual1stComplete(evalStatus[0]?.sentResult);
    };

    if (evalStatus) {
      assignStatus();
    }
  }, [evalStatus]);

  //FETCH DATA FOR HEAD EVAL
  useEffect(() => {
    axios
      .get(`${apiUrl}evaluation/getAllEvaluation`)
      .then((response) => {
        console.log("Fetched Evaluations:", response.data);

        const filteredEvaluations = response.data.filter(
          (evalItem) =>
            evalItem.evalType === "HEAD" &&
            evalItem.peer?.userID === user.userID
        );

        console.log("Filtered Evaluations:", filteredEvaluations);
        setEvaluationsData(filteredEvaluations);
      })
      .catch((error) => {
        console.error("There was an error fetching the evaluations!", error);
      });
  }, [user.userID]);

  //FETCH DATA FOR PEER EVAL
  useEffect(() => {
    axios
      .get(`${apiUrl}evaluation/evaluations`)
      .then((response) => {
        console.log("Fetched Evaluations:", response.data);

        // fetch userid from assigned_peer eval
        const currentUserEval = response.data.filter(
          (item) => item.userId === user.userID
        );

        console.log("Ang na fetch na user for peer eval:", currentUserEval);
        setPeerData(currentUserEval); // Set the filtered evaluations
      })
      .catch((error) => {
        console.error("There was an error fetching the evaluations!", error);
      });
  }, [user.userID]);

  //FETCH DATA FOR EMPLOYEE SELF & JOB EVAL
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}evaluation/getAllEvaluation`
        );
        const data = response.data;

        // Filter the evaluations based on user.userID
        const filteredEvaluations = data.filter(
          (evaluation) => evaluation.userId === user.userID
        );

        // Set the filtered evaluations to the state
        setUserData(filteredEvaluations);

        const evaluationYears = filteredEvaluations.map(
          (evaluation) => evaluation.schoolYear
        );
        const distinctYears = [...new Set(evaluationYears)];
        setYears(distinctYears);

        const hasAnnualPeriod = filteredEvaluations.some((evaluation) =>
          evaluation.period.includes("Annual")
        );

        if (hasAnnualPeriod) {
          setSelectedEvaluationPeriod("Annual-1st");
          setSelectedTab(0); // Assuming "Annual-1st" tab kay index 2
        } else {
          setSelectedTab(0); // Default to "3rd Month" tab
        }

        // Set the flag Annual word present siya
        setHasAnnualPeriod(hasAnnualPeriod);

        const filteredBySchoolYear = filteredEvaluations.filter(
          (evaluation) => evaluation.schoolYear === selectedYearEvaluation
        );

        // Extract unique semesters for the filtered evaluations
        const semesters = filteredBySchoolYear.map(
          (evaluation) => evaluation.semester
        );

        setSemesters(semesters);

        console.log(userData);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      }
    };

    fetchEvaluations();
  }, [selectedYearEvaluation]);
  console.log("user Data ", userData);
  console.log("Selected Semester:", semester);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}user/getUser/${user.userID}`
        );
        const data = response.data;

        // Set the is3rdEvalComplete state
        setIs3rdEvalComplete(data.is3rdEvalComplete);
        setIs5thEvalComplete(data.is5thEvalComplete);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user.userID]);

  console.log("ANG 3rd", is3rdEvalComplete);
  console.log("ANG 5th", is5thEvalComplete);

  useEffect(() => {
    const fetchEvalStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}eval-status`, {
          params: {
            userId: user.userID,
            academicYearId: currentAcadYear?.id,
          },
        });

        setEvalStatus(response.data);
      } catch (error) {
        console.error(
          "Error fetching and inserting eval status tracker:",
          error
        );
      }
    };

    if (currentAcadYear) {
      fetchEvalStatus();
    }
  }, [userData, currentAcadYear]);
  console.log("USER AYD:", evalStatus);
  console.log("USER ID FETCHED:", user.userID);
  console.log("MAO NI ANG ID:", evalStatus[0]?.id);

  const handleYearEvaluationChange = (event) => {
    setSelectedYearEvaluation(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    let period;
    if (hasAnnualPeriod) {
      if (newValue === 0) {
        period = "Annual-1st";
      } else if (newValue === 1) {
        period = "Annual-2nd";
      }
    } else {
      if (newValue === 0) {
        period = "3rd Month";
      } else if (newValue === 1) {
        period = "5th Month";
      }
    }

    setSelectedTab(newValue);
    setSelectedEvaluationPeriod(period);
    console.log("Selected Evaluation Period:", period);
  };

  const handleViewResults = () => {
    setShow3rd(true);
  };

  const handleClose3rdResults = () => {
    setShow3rd(false);
  };

  const handleOpen5thViewResult = () => {
    setShow5th(true);
  };

  const handleClose5thViewResult = () => {
    setShow5th(false);
  };

  const handleAnnual1stViewResult = () => {
    setShowAnnual1st(true);
  };

  const handleAnnual2ndViewResult = () => {
    setShowAnnual2nd(true);
  };

  const handleCloseAnnual1st = () => {
    setShowAnnual1st(false);
  };

  const handleCloseAnnual2nd = () => {
    setShowAnnual2nd(false);
  };

  const handleAnnualModalOpen = () => {
    setAnnual1stModal(true);
  };

  const handleAnnualModalClose = () => {
    setAnnual1stModal(false);
  };

  const handleAnnual2ndModalOpen = () => {
    setAnnual2ndModal(true);
  };

  const handleAnnual2ndModalClose = () => {
    setAnnual2ndModal(false);
  };

  const handle5thModalOpen = () => {
    setIs5thModal(true);
  };

  const handle5thModalClose = () => {
    setIs5thModal(false);
  };

  const handleConfirm5th = () => {
    setIs5thEvalComplete(true);
    setIs5thModal(false);
  };

  const handleConfirmAnnual1st = () => {
    setIsAnnual1stComplete(true);
    setAnnual1stModal(false);
  };

  const handleConfirmOpen = () => {
    setIs3rdModal(true);
  };

  const handleCloseConfirm = () => {
    setIs3rdModal(false);
  };

  const handleConfirmSent = () => {
    setIs3rdModal(false);
    setIs3rdEvalComplete(true);
  };

  const tabStyle = {
    textTransform: "none",
    fontFamily: "Poppins",
    fontSize: "14px",
  };

  const headStyle = {
    backgroundColor: "#8C383E",
    textAlign: "center",
    color: "white",
    fontFamily: "Poppins",
    fontSize: "13px",
    padding: "6px",
    width: "15%",
  };

  const tableStyle = {
    borderRadius: "5px 5px 5px 5px",
    marginTop: "5px",
    boxShadow: "2px 2px 5px rgba(157, 157, 157, 0.5)",
  };

  const renderEvaluationTable = () => {
    if (!selectedYearEvaluation || selectedYearEvaluation === " ") {
      return null;
    }

    // Check for Filter evaluations per user
    const userEval = peerData.filter(
      (evaluation) =>
        evaluation.schoolYear === selectedYearEvaluation &&
        evaluation.userId === user.userID &&
        evaluation.period === selectedEvaluationPeriod
    );

    const peerEval = peerData.filter((evaluation) => {
      if (!evaluation.sjbDateTaken) return false;
      return (
        evaluation.schoolYear === selectedYearEvaluation &&
        evaluation.period === selectedEvaluationPeriod &&
        evaluation.userId === user.userID
      );
    });

    const headEval = peerData.filter(
      (evaluation) =>
        evaluation.schoolYear === selectedYearEvaluation &&
        evaluation.userId === user.userID &&
        evaluation.period === selectedEvaluationPeriod
    );

    // Check completion status for each evaluation stage
    const hasCompletedValuesSelf = userEval.some(
      (evaluation) => evaluation.svbpaStatus === "COMPLETED"
    );

    const hasCompletedJobSelf = userEval.some(
      (evaluation) => evaluation.sjbpStatus === "COMPLETED"
    );

    const hasCompletedValuesPeer = peerEval.some(
      (evaluation) => evaluation.pvbpaStatus === "COMPLETED"
    );

    const hasCompletedHeadValues = headEval.some(
      (evaluation) => evaluation.hvbpaStatus === "COMPLETED"
    );

    const hasCompletedHeadJob = headEval.some(
      (evaluation) => evaluation.hjbpStatus === "COMPLETED"
    );

    const allValuesStagesCompleted =
      hasCompletedValuesSelf &&
      hasCompletedJobSelf &&
      hasCompletedHeadValues &&
      hasCompletedHeadJob;

    return (
      <TableContainer style={tableStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "#8C383E" }}>
                {" "}
              </TableCell>
              <TableCell align="center" style={headStyle}>
                Self
              </TableCell>
              <TableCell align="center" style={headStyle}>
                Head
              </TableCell>
              <TableCell align="center" style={headStyle}>
                Peer(s)
              </TableCell>
              <TableCell align="center" style={{ backgroundColor: "#8C383E" }}>
                {" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render VALUES based evaluations */}
            <TableRow>
              <TableCell align="center" style={{ width: "20%" }}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  style={{ color: "#8C383E", marginRight: "8px" }}
                />
                <span style={{ fontWeight: 500 }}>Values Based</span>
              </TableCell>
              <TableCell align="center">
                <VerifiedIconWrapper verified={hasCompletedValuesSelf} />
              </TableCell>
              <TableCell align="center">
                <VerifiedIconWrapper verified={hasCompletedHeadValues} />
              </TableCell>
              <TableCell align="center">
                <VerifiedIconWrapper verified={hasCompletedValuesPeer} />
              </TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                <Button
                  sx={{
                    color: "#8C383E",
                    textTransform: "none",
                    fontSize: "13px",
                    "&:hover": {
                      textDecoration: "underline",
                      borderStyle: "none",
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => {
                    handleViewResults();
                    handleOpen5thViewResult();
                    handleAnnual1stViewResult();
                    handleAnnual2ndViewResult();
                  }}
                  disabled={!allValuesStagesCompleted}
                >
                  <FontAwesomeIcon
                    icon={allValuesStagesCompleted ? faEye : faEyeSlash}
                    style={{
                      color: allValuesStagesCompleted ? "#8C383E" : "#A9A9A9",
                      marginRight: "10px",
                      marginLeft: "3.3em",
                    }}
                  />
                  View Results
                </Button>
              </TableCell>
            </TableRow>

            {/* Render JOB based evaluations */}
            <TableRow>
              <TableCell style={{ width: "20%" }}>
                <FontAwesomeIcon
                  icon={faScroll}
                  style={{
                    color: "#8C383E",
                    marginRight: "10px",
                    marginLeft: "4.3em",
                  }}
                />
                <span style={{ fontWeight: 500 }}>Job Based</span>
              </TableCell>
              <TableCell align="center">
                <VerifiedIconWrapper verified={hasCompletedJobSelf} />
              </TableCell>
              <TableCell align="center">
                <VerifiedIconWrapper verified={hasCompletedHeadJob} />
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Send Results Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
            mb: 1,
            mr: 4,
          }}
        >
          {/* Conditionally render the button based on the selected evaluation period */}
          {selectedEvaluationPeriod === "3rd Month" ? (
            <Button
              variant="contained"
              sx={{
                height: "2.5em",
                width: "11em",
                fontFamily: "Poppins",
                backgroundColor: "#8c383e",
                padding: "1px 1px 0 0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#762F34",
                  color: "white",
                },
              }}
              onClick={handleConfirmOpen}
              disabled={!allValuesStagesCompleted || is3rdEvalComplete}
            >
              {is3rdEvalComplete ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Result Sent
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Send Results
                </>
              )}
            </Button>
          ) : selectedEvaluationPeriod === "5th Month" ? (
            <Button
              variant="contained"
              sx={{
                height: "2.5em",
                width: "11em",
                fontFamily: "Poppins",
                backgroundColor: "#8c383e",
                padding: "1px 1px 0 0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#762F34",
                  color: "white",
                },
              }}
              onClick={handle5thModalOpen}
              disabled={!allValuesStagesCompleted || is5thEvalComplete}
            >
              {is5thEvalComplete ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Result Sent
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Send Results
                </>
              )}
            </Button>
          ) : selectedEvaluationPeriod === "Annual-1st" ? (
            <Button
              variant="contained"
              sx={{
                height: "2.5em",
                width: "11em",
                fontFamily: "Poppins",
                backgroundColor: "#8c383e",
                padding: "1px 1px 0 0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#762F34",
                  color: "white",
                },
              }}
              onClick={handleAnnualModalOpen}
              disabled={!allValuesStagesCompleted || isAnnual1stComplete}
            >
              {isAnnual1stComplete ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Result Sent
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Send Results
                </>
              )}
            </Button>
          ) : selectedEvaluationPeriod === "Annual-2nd" ? (
            <Button
              variant="contained"
              sx={{
                height: "2.5em",
                width: "11em",
                fontFamily: "Poppins",
                backgroundColor: "#8c383e",
                padding: "1px 1px 0 0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#762F34",
                  color: "white",
                },
              }}
              onClick={handleAnnual2ndModalOpen}
              disabled={!allValuesStagesCompleted || isAnnual2ndComplete}
            >
              {isAnnual2ndComplete ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Result Sent
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ fontSize: "15px", marginRight: "10px" }}
                  />{" "}
                  Send Results
                </>
              )}
            </Button>
          ) : null}
        </Box>
      </TableContainer>
    );
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            height: "91vh",
            //backgroundColor: "tomato",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <ThemeProvider theme={theme}>
          <Container
            style={{
              ...containerStyle,
              display: "flex",
              justifyContent: "center",
              minWidth: "95%",
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "5px",
                mb: 2,
                backgroundColor: "white",
                width: "98%",
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  color: "#8C383E",
                  fontSize: "15px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0 5px 20px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{ marginRight: "5px" }}
                />
                Back
              </button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 10px 10px 14px",
                  width: "97%",
                  backgroundColor: "white",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 10px 10px 14px",
                    width: "97%",
                    backgroundColor: "white",
                  }}
                >
                  <Box sx={{ ml: 8, mb: 2 }}>
                    <Avatar
                      alt="Employee"
                      src={
                        user.profilePic
                          ? base64ToDataURL(user.profilePic)
                          : "/user.png"
                      }
                      sx={{ width: "120px", height: "120px" }}
                    />
                  </Box>
                  <Box sx={{ ml: 8 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          fontSize="14px"
                          color="#9D9D9D"
                          mb={1}
                        >
                          Employee ID:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          mb={2}
                          fontWeight={500}
                          fontSize="16px"
                        >
                          {user.workID}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          fontSize="14px"
                          color="#9D9D9D"
                          mb={1}
                        >
                          Name:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          mb={2}
                          fontWeight={500}
                          fontSize="16px"
                        >
                          {user.fName} {user.lName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          mb={1}
                          fontSize="14px"
                          color="#9D9D9D"
                        >
                          Position:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          mb={2}
                          fontWeight={500}
                          fontSize="16px"
                        >
                          {user.position}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          fontSize="14px"
                          mb={1}
                          color="#9D9D9D"
                        >
                          Department:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontFamily="Poppins"
                          mb={2}
                          fontWeight={500}
                          fontSize="16px"
                        >
                          {user.dept}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 1.8,
                  mr: 2.5,
                  mt: 2,
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    fontFamily="Poppins"
                    color="#9D9D9D"
                    mr={1}
                  >
                    Set Year Evaluation:
                  </Typography>
                  <FormControl sx={{ minWidth: 90 }} size="small">
                    <Select
                      id="year-evaluation"
                      value={selectedYearEvaluation}
                      onChange={handleYearEvaluationChange}
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins",
                        color: "#1a1a1a",
                      }}
                    >
                      <MenuItem value=" ">Select Year</MenuItem>
                      {years.map((year) => (
                        <MenuItem value={year} key={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {selectedYearEvaluation !== " " && (
                  <Button
                    variant="contained"
                    sx={{
                      height: "2.5em",
                      width: "11em",
                      fontFamily: "Poppins",
                      backgroundColor: "#8c383e",
                      padding: "1px 1px 0 0 ",
                      "&:hover": { backgroundColor: "#762F34", color: "white" },
                    }}
                    style={{ textTransform: "none" }}
                    startIcon={
                      <FontAwesomeIcon
                        icon={faUsers}
                        style={{ fontSize: "15px" }}
                      />
                    }
                    onClick={handleOpenPeerModal}
                  >
                    Manage Peer
                  </Button>
                )}
              </Box>

              {console.log("si selected", selectedYearEvaluation)}

              {/* Display tabs and kung unsa year selected */}
              {selectedYearEvaluation != " " && (
                <Box sx={{ mt: 2, ml: 1.8, width: "97.1%" }}>
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                  >
                    {hasAnnualPeriod && (
                      <Tab label="Annual-1st Sem" style={tabStyle} />
                    )}

                    {hasAnnualPeriod && (
                      <Tab label="Annual-2nd Sem" style={tabStyle} />
                    )}

                    {!hasAnnualPeriod && (
                      <Tab label="3rd Month" style={tabStyle} />
                    )}
                    {!hasAnnualPeriod && (
                      <Tab label="5th Month" style={tabStyle} />
                    )}
                  </Tabs>
                  {selectedEvaluationPeriod === "3rd Month" &&
                    !hasAnnualPeriod && (
                      <Animated>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "20px",
                              display: "flex",
                              justifyContent: "center",
                              padding: 1,
                              color: "#1a1a1a",
                              fontWeight: "bold",
                            }}
                          >
                            3RD MONTH EVALUATION
                          </Typography>
                          {renderEvaluationTable()}
                          {show3rd && (
                            <AdminViewResult
                              userId={user.userID}
                              open={show3rd}
                              onClose={handleClose3rdResults}
                              selectedYear={selectedYearEvaluation}
                              selectedSemester={semester}
                              employee={user}
                              role={role}
                            />
                          )}
                        </Box>
                      </Animated>
                    )}
                  <SendResultsModal
                    isOpen={is3rdModal}
                    onCancel={handleCloseConfirm}
                    onConfirm={handleConfirmSent}
                    empUserId={user.userID}
                  />
                  {selectedEvaluationPeriod === "5th Month" &&
                    !hasAnnualPeriod && (
                      <Animated>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "20px",
                              display: "flex",
                              justifyContent: "center",
                              padding: 1,
                              color: "#1a1a1a",
                              fontWeight: "bold",
                            }}
                          >
                            5TH MONTH EVALUATION
                          </Typography>
                          {renderEvaluationTable()}
                          {show5th && (
                            <Admin5thViewResults
                              userId={user.userID}
                              open={show5th}
                              onClose={handleClose5thViewResult}
                              selectedYear={selectedYearEvaluation}
                              selectedSemester={semester}
                              employee={user}
                              role={role}
                            />
                          )}
                        </Box>
                      </Animated>
                    )}
                  <Send5thResultsModal
                    isOpen={is5thModalOpen}
                    onCancel={handle5thModalClose}
                    onConfirm={handleConfirm5th}
                    empUserId={user.userID}
                  />
                  {selectedEvaluationPeriod === "Annual-1st" && (
                    <Animated>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "20px",
                            display: "flex",
                            justifyContent: "center",
                            padding: 1,
                            color: "#1a1a1a",
                            fontWeight: "bold",
                          }}
                        >
                          FIRST SEMESTER EVALUATION
                        </Typography>
                        {renderEvaluationTable()}
                        {showAnnual1st && (
                          <AdminAnnual1stResults
                            userId={user.userID}
                            open={showAnnual1st}
                            onClose={handleCloseAnnual1st}
                            employee={user}
                            role={role}
                            selectedYear={selectedYearEvaluation}
                            selectedSemester={semester}
                          />
                        )}
                      </Box>
                    </Animated>
                  )}
                  <SendAnnual1st
                    isOpen={annual1stModal}
                    evalId={evalStatus[0]?.id}
                    onCancel={handleAnnualModalClose}
                    onConfirm={handleConfirmAnnual1st}
                    empUserId={user.userID}
                  />
                  {selectedEvaluationPeriod === "Annual-2nd" && (
                    <Animated>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "20px",
                            display: "flex",
                            justifyContent: "center",
                            padding: 1,
                            color: "#1a1a1a",
                            fontWeight: "bold",
                          }}
                        >
                          SECOND SEMESTER EVALUATION
                        </Typography>
                        {renderEvaluationTable()}
                        {showAnnual2nd && (
                          <AdminAnnual2ndResults
                            userId={user.userID}
                            open={showAnnual2nd}
                            onClose={handleCloseAnnual2nd}
                            selectedYear={selectedYearEvaluation}
                            selectedSemester={semester}
                            employee={user}
                            role={role}
                          />
                        )}
                      </Box>
                    </Animated>
                  )}
                  <SendAnnual2nd
                    isOpen={annual2ndModal}
                    onCancel={handleAnnual2ndModalClose}
                    onConfirm={handleConfirm5th}
                    empUserId={user.userID}
                  />
                </Box>
              )}
            </Box>
          </Container>
          <ManagePeerModal
            openModal={openModal}
            userId={user.userID}
            selectedEvaluationPeriod={selectedEvaluationPeriod}
            year={years}
            handleCloseModal={handleClosPeerModal}
          />
        </ThemeProvider>
      )}
    </div>
  );
}

export default EmployeeProfile;
