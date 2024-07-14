import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Tabs,
  Tab,
} from "@mui/material";
import Chart from "react-apexcharts";
import Matrix from "../modals/Matrix";
import ThirdMonthComments from "../modals/ThirdMonthComments";
import FifthMonthComments from "../modals/FifthMonthComments";
import axios from "axios";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const evaluationHeaderStyles = {
  // backgroundColor: "lightblue",
  height: "8vh",
  width: "100%",
  alignItems: "center",
  display: "flex",
  paddingLeft: "45px",
};

function ViewRatingsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [employee, setEmployee] = useState({});
  const userId = sessionStorage.getItem("userID");

  //adi changes
  //self values average
  const [selfValuesAveThirdMonth, setSelfValuesAveThirdMonth] = useState(0.0);
  //self job average
  const [selfJobAveThirdMonth, setSelfJobAveThirdMonth] = useState(0.0);
  //head values average
  const [headValuesAveThirdMonth, setHeadValuesAveThirdMonth] = useState(0.0);
  //head job average
  const [headJobAveThirdMonth, setHeadJobAveThirdMonth] = useState(0.0);

  //self values:
  const [selfCultAve, setSelfCultAve] = useState(0.0);
  const [selfIntAve, setSelfIntAve] = useState(0.0);
  const [selfTeamAve, setSelfTeamAve] = useState(0.0);
  const [selfUnivAve, setSelfUnivAve] = useState(0.0);

  //head values:
  const [headCultAve, setHeadCultAve] = useState(0.0);
  const [headIntAve, setHeadIntAve] = useState(0.0);
  const [headTeamAve, setHeadTeamAve] = useState(0.0);
  const [headUnivAve, setHeadUnivAve] = useState(0.0);

  //self job
  const [selfJobAve, setSelfJobAve] = useState(0.0);

  //Head
  const [headValuesThirdMonth, setHeadValuesThirdMonth] = useState(0.0);

  //OVERALLS:
  const [overallSelfVBPA, setOverallSelfVBPA] = useState(0.0); //SELF VALUES
  const [overallSelfJBPA, setOverallSelfJBPA] = useState(0.0); //SELF JOB
  const [overallHeadJBPA, setOverallHeadJBPA] = useState(0.0); //HEAD JOB
  const [overallHeadVBPA, setOverallHeadVBPA] = useState(0.0); //HEAD VALUES

  const handleOverallSelfVBPA = (cultAve, intAve, teamAve, univAve) => {
    return (cultAve + intAve + teamAve + univAve) / 4;
  };

  const handleOverallSelfJBPA = (jobAve) => {
    return jobAve * 0.2;
  };

  const handleOverallHeadJBPA = (jobAve) => {
    return jobAve * 0.6;
  };

  const handleOverallHeadVBPA = (cultAve, intAve, teamAve, univAve) => {
    return (cultAve + intAve + teamAve + univAve) / 4;
  };

  //fetch Averages
  useEffect(() => {
    //If 3rd month tab is open
    if (tabIndex === 0) {
      //SELF VALUES
      const fetchSelfValuesThirdMonth = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/results/getAverages`,
            {
              params: {
                userId: userId,
                evalType: "SELF",
                stage: "VALUES",
                period: "3rd Month",
              },
            }
          );

          const data = response.data;
          setSelfCultAve(data.cultureOfExcellenceAverage);
          setSelfIntAve(data.integrityAverage);
          setSelfTeamAve(data.teamworkAverage);
          setSelfUnivAve(data.universalityAverage);

          const overallSelfVBPA = handleOverallSelfVBPA(
            data.cultureOfExcellenceAverage,
            data.integrityAverage,
            data.teamworkAverage,
            data.universalityAverage
          );

          setOverallSelfVBPA(overallSelfVBPA);

          console.log("Overall Self Values Based PA:", overallSelfVBPA);
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

      //SELF JOB
      const fetchSelfJobThirdMonth = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/results/getAverages`,
            {
              params: {
                userId: userId,
                evalType: "SELF",
                stage: "JOB",
                period: "3rd Month",
              },
            }
          );

          const data = response.data;

          const overallSelfJBPA = handleOverallSelfJBPA(data.jobRespAverage);
          setOverallSelfJBPA(overallSelfJBPA);
          console.log("Overall Self Job Based PA:", overallSelfJBPA);
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
      };

      //HEAD JOB
      const fetchHeadJobThirdMonth = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/results/getJobRespAverageByEmpId`,
            {
              params: {
                empId: userId,
              },
            }
          );

          const data = response.data;
          const overallHeadJBPA = handleOverallHeadJBPA(data);
          setOverallHeadJBPA(overallHeadJBPA);
          console.log("Overall Head Job Based PA:", overallHeadJBPA);
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
      };

      //HEAD VALUES
      const fetchHeadValuesThirdMonth = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/results/getValuesAveragesByEmpIdAndEvalType`,
            {
              params: {
                empId: userId,
              },
            }
          );

          const data = response.data;

          const overallHeadVBPA = handleOverallHeadVBPA(
            data.cultureOfExcellenceAverage,
            data.integrityAverage,
            data.teamworkAverage,
            data.universalityAverage
          );

          setHeadCultAve(data.cultureOfExcellenceAverage);
          setHeadIntAve(data.integrityAverage);
          setHeadTeamAve(data.teamworkAverage);
          setHeadUnivAve(data.universalityAverage);

          setOverallHeadVBPA(overallHeadVBPA);
          console.log("Overall Head Values Based PA:", overallHeadVBPA);
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
      };

      fetchSelfValuesThirdMonth();
      fetchSelfJobThirdMonth();
      fetchHeadValuesThirdMonth();
      fetchHeadJobThirdMonth();
    }
  }, [tabIndex, userId]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const tabStyle = {
    textTransform: "none",
    color: "#9D9D9D",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: "bold",
    "& .MuiTabs-indicator": {
      backgroundColor: "#8C383E", //nig click makita maroon
    },
    "&.Mui-selected": {
      color: "#8C383E", //kung unsa selected
    },
  };

  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userId}`
        );
        setEmployee(response.data);
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
    fetchUser();
  }, []);

  // Example chart options and series
  const JBPChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: ["#151515", "#FF0000", "#FCDC2A"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Values-Based Performance", "Jobs-Based Performance"],
    },
    yaxis: {
      title: {
        text: "Scores (0 - 5)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " points";
        },
      },
    },
  };

  const JBPChartSeries = [
    {
      name: "Head",
      data: [4.4, 5],
    },
    {
      name: "Self",
      data: [4.0, 3],
    },
    {
      name: "Peer",
      data: [4.4, null],
    },
  ];

  const VBPChartSeries = [
    {
      name: "Head",
      data: [headCultAve, headIntAve, headTeamAve, headUnivAve],
    },
    {
      name: "Self",
      data: [selfCultAve, selfIntAve, selfTeamAve, selfUnivAve],
    },
    {
      name: "Peer",
      data: [4.4, 4.6, 3, 4.6],
    },
  ];

  const VBPAChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: ["#151515", "#FF0000", "#FCDC2A"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Culture of Excellence",
        "Integrity",
        "Teamwork",
        "Universality",
      ],
    },
    yaxis: {
      title: {
        text: "Scores (0 - 5)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " points";
        },
      },
    },
  };

  return (
    <div
      style={{
        //backgroundColor: "yellow",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={evaluationHeaderStyles}>
        <h1
          style={{
            //backgroundColor: "yellow",
            flex: 1,
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Results
        </h1>
      </div>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "79vw",
          height: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          className="ml-4"
          sx={tabStyle}
        >
          <Tab label="3rd Month" sx={tabStyle} />
          <Tab label="5th Month" sx={tabStyle} />
        </Tabs>

        {/* 3RD EVALUATION TAB*/}
        <div className="mx-4 mb-4">
          <TabPanel value={tabIndex} index={0}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Expanded Administrative Performance Assessment (e-AEPA) :
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                mt: 1,
                fontFamily: "Poppins",
              }}
            >
              3RD MONTH EVALUATION RESULT
            </Typography>
            <Divider
              sx={{
                borderBottom: "3px solid",
                width: "80%",
                margin: "auto",
                my: 2,
              }}
            />
            <div className="flex">
              {/* Employee Info Table */}
              <div className="me-auto">
                <TableContainer
                  sx={{
                    width: 500,
                    maxHeight: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      bgcolor: "#808080",
                      color: "white",
                      p: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    Employee Identifying Information
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.workID}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee Name
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.fName + " " + employee.lName}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee Position
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.position}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Department
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.dept}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="mr-4">
                {/* Weight & Overall AEPA Table */}
                <TableContainer
                  sx={{
                    maxWidth: 500,
                    height: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Weight
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Overall AEPA
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            border: "1px solid #ccc",
                            fontWeight: "bold",
                            fontSize: "1em",
                          }}
                        >
                          4.70
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          60%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Values-Based Performance Assessment
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="right"
                        >
                          4.5
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          40%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Job-Based Performance Assessment
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="right"
                        >
                          5.0
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Rating Period Table */}
            {/* Rating Period Table */}
            <TableContainer
              sx={{
                maxWidth: 500,
                maxHeight: 220,
                mb: 2,
                mx: 1,
                border: "2px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        backgroundColor: "grey",
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Rating Period
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "grey",
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      3RD MONTH PERIOD EVALUATION
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date of Appraisal
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      02/20/2024
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date Hired
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      {employee.dateHired}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date of Review
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      02/20/2024
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Flex Container for Charts */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {/* First Chart */}
              <Box sx={{ width: "50%", p: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "#E81B1B",
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    height: "30px",
                    borderBottom: "3px solid #F8C702",
                  }}
                >
                  Multi-Reference Performance Appraisal
                </Box>
                <Chart
                  options={JBPChartOptions}
                  series={JBPChartSeries}
                  type="bar"
                  height={320}
                />
              </Box>

              {/* Second Chart */}
              <Box sx={{ width: "50%", p: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "#E81B1B",
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    height: "30px",
                    borderBottom: "3px solid #F8C702",
                  }}
                >
                  Visualized Values-Based Performance Assessment
                </Box>
                <Chart
                  options={VBPAChartOptions}
                  series={VBPChartSeries}
                  type="bar"
                  height={320}
                />
              </Box>
            </Box>

            {/* Performance Appraisal Average Table */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ width: "45%", p: 1 }}>
                <TableContainer
                  sx={{
                    maxWidth: "auto",
                    maxHeight: "100%",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Weight of Reference
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          60%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          20%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          20%
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Assessment Factor
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Head
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FF0000",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Self
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FCDC2A",
                            color: "black",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Values-Based Performance
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(Math.round(overallHeadVBPA * 100) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(Math.round(overallSelfVBPA * 100) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Job-Based Performance
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(Math.round(overallHeadJBPA * 100) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(Math.round(overallSelfJBPA * 100) / 100).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Poppins",
                          }}
                        >
                          Reference Average
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(
                            Math.round(
                              (overallHeadVBPA * 0.6 + overallHeadJBPA * 0.4) *
                                100
                            ) / 100
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(
                            Math.round(
                              (overallSelfVBPA * 0.6 + overallSelfJBPA * 0.4) *
                                100
                            ) / 100
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Overall VBPA Average Table */}
              <Box sx={{ width: "45%", p: 1 }}>
                <TableContainer
                  sx={{
                    maxWidth: "auto",
                    maxHeight: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Poppins",
                          }}
                        >
                          Assessment Factor
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Head
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FF0000",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Self
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FCDC2A",
                            color: "black",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Culture of Excellence
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {headCultAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {selfCultAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Integrity
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {headIntAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {selfIntAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Teamwork
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {headTeamAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {selfTeamAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Poppins" }}>
                          Universality
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {headUnivAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {selfUnivAve}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            fontFamily: "Poppins",
                          }}
                        >
                          Overall VBPA
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(headCultAve +
                            headIntAve +
                            headTeamAve +
                            headUnivAve) /
                            4}
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {(selfCultAve +
                            selfIntAve +
                            selfTeamAve +
                            selfUnivAve) /
                            4}
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          0.0
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <Matrix />
            <ThirdMonthComments />
          </TabPanel>
        </div>

        {/* 5TH EVALUATION TAB*/}
        <div className="mx-4 mb-4 -mt-4">
          <TabPanel value={tabIndex} index={1}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Expanded Administrative Performance Assessment (e-AEPA) :
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                mt: 1,
                fontFamily: "Poppins",
              }}
            >
              5TH MONTH EVALUATION RESULT
            </Typography>
            <Divider
              sx={{
                borderBottom: "3px solid",
                width: "80%",
                margin: "auto",
                my: 2,
              }}
            />
            <div className="flex">
              {/* Employee Info Table */}
              <div className="me-auto">
                <TableContainer
                  sx={{
                    width: 500,
                    maxHeight: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      bgcolor: "#808080",
                      color: "white",
                      p: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    Employee Identifying Information
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.workID}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee Name
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.fName + " " + employee.lName}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Employee Position
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.position}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "40%",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Department
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          {employee.dept}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="mr-4">
                {/* Weight & Overall AEPA Table */}
                <TableContainer
                  sx={{
                    maxWidth: 500,
                    height: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Weight
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Overall AEPA
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            border: "1px solid #ccc",
                            fontWeight: "bold",
                            fontSize: "1em",
                          }}
                        >
                          4.70
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          60%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Values-Based Performance Assessment
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="right"
                        >
                          4.5
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          40%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                        >
                          Job-Based Performance Assessment
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="right"
                        >
                          5.0
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Rating Period Table */}
            <TableContainer
              sx={{
                maxWidth: 500,
                maxHeight: 220,
                mb: 2,
                mx: 1,
                border: "2px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        backgroundColor: "grey",
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Rating Period
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "grey",
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      5TH MONTH PERIOD EVALUATION
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date of Appraisal
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      02/20/2024
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date Hired
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      {employee.dateHired}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                        border: "1px solid #ccc",
                        fontFamily: "Poppins",
                      }}
                    >
                      Date of Review
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", fontFamily: "Poppins" }}
                    >
                      02/20/2024
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Flex Container for Charts */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {/* First Chart */}
              <Box sx={{ width: "50%", p: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "#E81B1B",
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    height: "30px",
                    borderBottom: "3px solid #F8C702",
                  }}
                >
                  Multi-Reference Performance Appraisal
                </Box>
                <Chart
                  options={JBPChartOptions}
                  series={JBPChartSeries}
                  type="bar"
                  height={320}
                />
              </Box>

              {/* Second Chart */}
              <Box sx={{ width: "50%", p: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "#E81B1B",
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    height: "30px",
                    borderBottom: "3px solid #F8C702",
                  }}
                >
                  Visualized Values-Based Performance Assessment
                </Box>
                <Chart
                  options={VBPAChartOptions}
                  series={VBPChartSeries}
                  type="bar"
                  height={320}
                />
              </Box>
            </Box>

            {/* Performance Appraisal Average Table */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ width: "45%", p: 1 }}>
                <TableContainer
                  sx={{
                    maxWidth: "auto",
                    maxHeight: "100%",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {" "}
                        {/* Adjust the height of the header row */}
                        <TableCell>Weight of Reference</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          60%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          20%
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          20%
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {" "}
                        {/* Adjust the height of the first body row */}
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Assessment Factor
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Head
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FF0000",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Self
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FCDC2A",
                            color: "black",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: "20px" }}>
                        {" "}
                        {/* Adjust the height of the second body row */}
                        <TableCell>Values-Based Performance</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ height: "20px" }}>
                        {" "}
                        {/* Adjust the height of the third body row */}
                        <TableCell>Job-Based Performance</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          5.00
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          5.00
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                      </TableRow>
                      <TableRow sx={{ height: "20px" }}>
                        {" "}
                        {/* Adjust the height of the fourth body row */}
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Reference Average
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.70
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.70
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Overall VBPA Average Table */}
              <Box sx={{ width: "45%", p: 1 }}>
                <TableContainer
                  sx={{
                    maxWidth: "auto",
                    maxHeight: "auto",
                    mb: 2,
                    mx: 1,
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Assessment Factor
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#151515",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Head
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FF0000",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Self
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#FCDC2A",
                            color: "black",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Culture of Excellence</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Integrity</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Teamwork</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          5.00
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Universality</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          5.00
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          Overall VBPA
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.70
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "grey",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.50
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
            <Matrix />
            <FifthMonthComments />
          </TabPanel>
        </div>
      </Box>
    </div>
  );
}

export default ViewRatingsPage;
