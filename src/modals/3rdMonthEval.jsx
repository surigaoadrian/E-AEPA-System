import React, { useState, useEffect } from "react";
import {Box, Typography, Divider, Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from "@mui/material";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import matrix from "../assets/matrixx.png";
import arrow from "../assets/arrow.png";
import boxes from "../assets/matrixboxes.png";
import bottomArrow from "../assets/bottomarrow.png";
import Chart from "react-apexcharts";
import ThirdMonthComments from "../modals/3rdMonthComments";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";


const ThirdMonthEval = ({ userId, role, filter}) => {
  const [employee, setEmployee] = useState({});
  const [department, setDepartment] = useState("");
  const [headFullname, setHeadFullname] = useState("");
  const [headPosition, setHeadPosition] = useState("");
  //const userId = sessionStorage.getItem("userID");

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

  //OVERALLS:
  const [overallSelfVBPA, setOverallSelfVBPA] = useState(0.0); //SELF VALUES
  const [overallSelfJBPA, setOverallSelfJBPA] = useState(0.0); //SELF JOB
  const [overallHeadJBPA, setOverallHeadJBPA] = useState(0.0); //HEAD JOB
  const [overallHeadVBPA, setOverallHeadVBPA] = useState(0.0); //HEAD VALUES
  const [overallVBPAAverage, setOverallVBPAAverage] = useState(0.0);
  const [overallJBPAverage, setOverallJBPAverage] = useState(0.0);
  const [overallEAPAAverage, setOverallEAPAAverage] = useState(0.0);

  const handleOverallSelfVBPA = (cultAve, intAve, teamAve, univAve) => {
    return (cultAve + intAve + teamAve + univAve) / 4;
  };

  const handleOverallHeadVBPA = (cultAve, intAve, teamAve, univAve) => {
    return (cultAve + intAve + teamAve + univAve) / 4;
  };

  const handleOverallSelfJBPA = (jobAve) => {
    return jobAve ;
  };

  const handleOverallHeadJBPA = (jobAve) => {
    return jobAve;
  };

  const scores = {
    overall: {
      overallEAPAAverage: overallEAPAAverage,
      overallVBPAAverage: overallVBPAAverage,
      overallJBPAverage: overallJBPAverage,
    },
    self: {
      overallEAPAAverage: (((overallSelfVBPA * 0.6) + (overallSelfJBPA * 0.4))).toFixed(2),
      overallVBPAAverage: overallSelfVBPA.toFixed(2),
      overallJBPAverage: overallSelfJBPA.toFixed(2),
    },
    peer: {
      overallEAPAAverage: null,
      overallVBPAAverage: 4.5,
      overallJBPAverage: 0,
    },
    head: {
      overallEAPAAverage: (((overallHeadVBPA * 0.6) + (overallHeadJBPA * 0.4))).toFixed(2),
      overallVBPAAverage: overallHeadVBPA.toFixed(2),
      overallJBPAverage: overallHeadJBPA.toFixed(2),
    }
  };

  const filteredScores = scores[filter] || scores.overall;

  useEffect(() => {
    const fetchHeadData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getAllUser`);
        const users = response.data;

        const head = users.find(
          (user) => user.dept === department && user.position === "Department Head"
        );

        if (head) {
          setHeadFullname(`${head.fName} ${head.lName}`);
          setHeadPosition(head.position);
          console.log("Head data:", head);
        }
      } catch (error) {
        console.error("Error fetching department head data:", error);
      }
    };

    if (department) {
      fetchHeadData();
    }
  }, [department]);


  //fetch overall averages
  useEffect(() => {
    const validNumber = (value, defaultValue = 0) => {
      return typeof value === 'number' && !isNaN(value) ? value : defaultValue;
    };
  
    const selfVBPA = validNumber(overallSelfVBPA);
    const headVBPA = validNumber(overallHeadVBPA);
    const selfJBPA = validNumber(overallSelfJBPA);
    const headJBPA = validNumber(overallHeadJBPA);
  
    const vbpaAverage = ((selfVBPA + headVBPA + 4.5) / 3).toFixed(2);
    const jbpaAverage = ((selfJBPA + headJBPA) / 2).toFixed(2);
    const overallAverage = (((vbpaAverage * .6)+ (jbpaAverage * .4)) ).toFixed(2);

    setOverallVBPAAverage(vbpaAverage);
    setOverallJBPAverage(jbpaAverage);
    setOverallEAPAAverage(overallAverage);
  }, [overallSelfVBPA, overallHeadVBPA, overallSelfJBPA, overallHeadJBPA]);
  

  //fetch Averages
  useEffect(() => {
    const fetchData =  async () => {
      //setLoading(true); 
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

          setOverallSelfVBPA(isNaN(overallSelfVBPA) ? 0 : overallSelfVBPA);

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
          setOverallSelfJBPA(isNaN(overallSelfJBPA) ? 0 : overallSelfJBPA);
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
            
    };

    fetchData();
  }, [userId]);

  const formatValue = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '';
    }
    return (value.toFixed(2).replace(/(\.0+|(?<=\.\d)0+)$/, '') || '0');
  };
  
// Custom shape function that renders an emoji
const renderPin = (props) => {
  const { cx, cy } = props;
  return <text x={cx} y={cy} dy={5} dx={-15} fontSize={20} >✅</text>;
};

// Custom tooltip function
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #999', padding: '8px', fontSize:'0.8em' }}>
        <p>Values-Based Performance: {payload[0].payload.valuesPerformance}</p>
        <p>Jobs-Based Performance: {payload[0].payload.jobsPerformance}</p>
      </div>
    );
  }
  return null;
};
  //Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userId}`
        );
        setEmployee(response.data);
        setDepartment(response.data.dept);
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
      data: [overallHeadVBPA, overallHeadJBPA],
    },
    {
      name: "Self",
      data: [overallSelfVBPA, overallSelfJBPA],
    },
    {
      name: "Peer",
      data: [4.5, null],
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
      data: [4.4, 4.6, 4.4, 4.6],
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

  const employeeData = [
    {valuesPerformance: filteredScores.overallVBPAAverage, jobsPerformance: filteredScores.overallJBPAverage }
  ];


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

        {/* 3RD EVALUATION TAB*/}
        <div className="mx-4 mb-4">
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
                    width: "500px",
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
                           {filteredScores.overallEAPAAverage}
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
                           {filteredScores.overallVBPAAverage}
          
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
                             {filteredScores.overallJBPAverage}
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
                      07/03/2024
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
                      07/03/2024
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
                          {formatValue(overallHeadVBPA)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(overallSelfVBPA)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.5
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
                        >{formatValue(overallHeadJBPA)}</TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(overallSelfJBPA)}
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
                        {formatValue(overallHeadVBPA * 0.6 + overallHeadJBPA * 0.4)} </TableCell>
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
                        {formatValue(overallSelfVBPA * 0.6 + overallSelfJBPA * 0.4)}</TableCell>
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
                          {formatValue(headCultAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfCultAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.4
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
                         {formatValue(headIntAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfIntAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.6
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
                          {formatValue(headTeamAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfTeamAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.4
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
                         {formatValue(headUnivAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfUnivAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.6
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
              {formatValue((headCultAve + headIntAve + headTeamAve + headUnivAve) / 4)}
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
              {formatValue((selfCultAve + selfIntAve + selfTeamAve + selfUnivAve) / 4)}
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
        {/* MATRIX*/}
            <div>
      <Box className="mb-4" sx={{ 
        backgroundColor: '#E81B1B', 
        color: 'white', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        height: '30px', 
        borderBottom: '3px solid #F8C702'
      }}>
        Career Development Conversation Matrix
      </Box>
      <div className='flex justify-center'>
      <img src={arrow} style={{ width: '100px', height: '500px' }} />
      <div className='mt-10' style={{ height: '500px',width: '700px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{top: 20,right: 15,bottom: 20,left: 10 }}>
            <image xlinkHref={matrix} x="0" y="0" width="100%" height="100%" />
            <XAxis type="number" dataKey="valuesPerformance" name="Values-Based Performance" domain={[1, 5]}>
              <Label value="Values-Based Performance" offset={-20} position="insideBottom" style={{ fontWeight:'bold',textAnchor: 'middle' }} />
            </XAxis>
            <YAxis type="number" dataKey="jobsPerformance" name="Jobs-Based Performance" domain={[1, 5]}>
              <Label value="Jobs-Based Performance" angle={-90} position="insideLeft" offset={10} style={{ fontWeight:'bold',textAnchor: 'middle' }}/>
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Employee Performance" data={employeeData} fill="#f00" shape={renderPin} />
          </ScatterChart>
        </ResponsiveContainer>
        </div>
        <img src={boxes} className='ml-16' style={{ width: 'auto', height: '500px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight:'124px' }}>
  <img src={bottomArrow} alt="Bottom Arrow" style={{ width: 'auto', height: '100px' }} />
</div>

{filter === "peer" && (
  <Box>      
    <Box className="mb-2 mt-4" sx={{ 
    backgroundColor: '#E81B1B', 
    color: 'white', 
    p: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    height: '30px', 
    borderBottom: '3px solid #F8C702'
  }}>
    Values-Based Performance Assessment Summary
  </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
{/* Overall VBPA Average Table (per peer) */}
<Box  sx={{ width: "45%", p: 1}}>
                <TableContainer
                  sx={{
                    maxWidth: "600px",
                    maxHeight: "400px",
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
                          CIT-U's Core Values
                        </TableCell>
                        <TableCell
                        className="w-24"
                          sx={{
                            backgroundColor: "#151515",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer 1
                        </TableCell>
                        <TableCell
                        className="w-24"
                          sx={{
                            backgroundColor: "#FF0000",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer 2
                        </TableCell>
                        <TableCell
                        className="w-24"
                          sx={{
                            backgroundColor: "#FCDC2A",
                            color: "black",
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                          }}
                          align="center"
                        >
                          Peer 3
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
                          {formatValue(headCultAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfCultAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.4
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
                         {formatValue(headIntAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfIntAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.6
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
                          {formatValue(headTeamAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfTeamAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.4
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
                         {formatValue(headUnivAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          {formatValue(selfUnivAve)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            fontFamily: "Poppins",
                            textAlign: "center",
                          }}
                        >
                          4.6
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
              {formatValue((headCultAve + headIntAve + headTeamAve + headUnivAve) / 4)}
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
              {formatValue((selfCultAve + selfIntAve + selfTeamAve + selfUnivAve) / 4)}
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
              </Box>
      )}
    </div>
            <ThirdMonthComments userId={userId} filter={filter} role={role} />
            <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div style={{ width: "50%" }}>
          <h2 className="mb-8 italic">Certified by Immediate Head:</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              Name of Head:
              <span
                style={{
                  marginLeft: "10px",
                  width: "400px",
                  border: "2px solid gray",
                  padding: "2px",
                  display: "inline-block",
                }}
              >
                 {headFullname}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              Position / Title:
              <span
                style={{
                  marginLeft: "15px",
                  width: "400px",
                  border: "2px solid gray",
                  padding: "2px",
                  display: "inline-block",
                }}
              >
                {headPosition}
              </span>
            </div>
          </div>
        </div>

        <div style={{ width: "50%" }}>
          <h2 className="mb-8 italic">
            I acknowledge the receipt of this evaluation:
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              Name of Staff:
              <span
                style={{
                  marginLeft: "12px",
                  width: "400px",
                  border: "2px solid gray",
                  padding: "2px",
                  display: "inline-block",
                }}
              >
                {employee.fName + " " + employee.lName}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              Position / Title:
              <span
                style={{
                  marginLeft: "10px",
                  width: "400px",
                  border: "2px solid gray",
                  padding: "2px",
                  display: "inline-block",
                }}
              >
                {employee.position}
              </span>
            </div>
          </div>
        </div>
      </div>
        </div>

    </div>
    
  );
}

export default ThirdMonthEval;
