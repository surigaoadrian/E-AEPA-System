import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import SchoolYearModal from "../modals/SchoolYearModal";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faHandshake,
  faUsers,
  faUser,
  faUsersSlash,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import Loader from "../components/Loader";
import axios from "axios";
import { apiUrl } from "../config/config";
import { isSameMonth } from "date-fns";
import Animated from "../components/motion";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [openSYModal, setOpenSYModal] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [openAddSY, setOpenAddSY] = useState(false);
  const [openEditView, setOpenEditView] = useState(false);
  const [pieMonth, setPieMonth] = useState("3rd Month");
  const [pieData, setPieData] = useState({
    "3rd Month": [0, 0, 0],
    "5th Month": [0, 0, 0],
  });

  const [thirdMonthEmpCount, setThirdMonthEmpCount] = useState(0);
  const [fifthMonthEmpCount, setFifthMonthEmpCount] = useState(0);
  const [regEmpCount, setRegEmpCount] = useState(0);
  const [regEmpCountFromTable, setRegEmpCountFromTable] = useState(0);
  const [thirdMonthEmp, setThirdMonthEmp] = useState([]);
  const [fifthMonthEmp, setFifthMonthEmp] = useState([]);

  const getCurrentMonthAndYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear(); // Current year as an integer

    return { month, year };
  };

  const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();
  console.log("Current month and year:", currentMonth, currentYear);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  //fetch 3rd, 5th, Reg emp count
  useEffect(() => {
    const fetchEmpCount = async () => {
      try {
        const [response1, response2, response3] = await Promise.all([
          axios.get(`${apiUrl}user/getThirdMonthEmpCount`),
          axios.get(`${apiUrl}user/getFifthMonthEmpCount`),
          axios.get(`${apiUrl}user/getRegularEmpCount`),
        ]);

        setThirdMonthEmpCount(response1.data);
        setFifthMonthEmpCount(response2.data);
        setRegEmpCount(response3.data);

        console.log("Fetched regEmpCount:", response3.data);
      } catch (error) {
        console.error("Error fetching employee count:", error);
      }
    };

    fetchEmpCount();
  }, []);

  //get reg emp count and updates in the table if there are changes
  useEffect(() => {
    const fetchRegEmpCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}regEmpCount/count`, {
          params: { month: currentMonth, year: currentYear },
        });
        setRegEmpCountFromTable(response.data);
        console.log("Fetched regEmpCountFromTable:", response.data);
      } catch (error) {
        console.error(
          "Error fetching regular employee count from tblregempcount:",
          error
        );
      }
    };

    if (currentMonth && currentYear) {
      fetchRegEmpCount();
    }
  }, [currentMonth, currentYear]);

  //condition if regEmpCount is not equal to regEmpCountFromTable then update
  useEffect(() => {
    const updateRegEmpCount = async () => {
      try {
        console.log(
          "Comparing regEmpCount:",
          regEmpCount,
          "with regEmpCountFromTable:",
          regEmpCountFromTable
        );

        if (regEmpCount !== regEmpCountFromTable) {
          console.log(
            "Counts are not equal. Updating regEmpCount in the table."
          );

          const response = await axios.patch(
            `${apiUrl}regEmpCount/update`,
            null,
            {
              params: {
                month: currentMonth,
                year: currentYear,
                currentRegEmpCount: regEmpCount,
              },
            }
          );
          console.log("Update response:", response.data);
        } else {
          console.log("Counts are equal. No update needed."); // Log if no update is needed
        }
      } catch (error) {
        console.error(
          "Error updating regular employee count from tblregempcount:",
          error
        );
      }
    };

    if (regEmpCountFromTable && regEmpCount) {
      updateRegEmpCount();
    }
  }, [regEmpCountFromTable, regEmpCount]);

  //filter third month employees
  const filterThirdMonthEmployees = (employees) => {
    const currentDate = new Date();

    return employees.filter((employee) => {
      const dateHired = new Date(employee.dateHired);
      const threeMonthsAfterHire = new Date(
        dateHired.setMonth(dateHired.getMonth() + 3)
      );

      return isSameMonth(threeMonthsAfterHire, currentDate);
    });
  };

  //filter fifth month employees
  const filterFifthMonthEmployees = (employees) => {
    const currentDate = new Date();

    return employees.filter((employee) => {
      const dateHired = new Date(employee.dateHired);
      const fiveMonthsAfterHire = new Date(
        dateHired.setMonth(dateHired.getMonth() + 5)
      );

      return isSameMonth(fiveMonthsAfterHire, currentDate);
    });
  };

  //fetch 3rd month probationary employees
  useEffect(() => {
    const fetchProbationaryEmp = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/get3rdMonthProbeEmp`);
        const response2 = await axios.get(`${apiUrl}user/get5thMonthProbeEmp`);
        const thirdMonthEmployees = response.data;
        const fifthMonthEmployees = response2.data;

        const filtered3rdMonthEmp =
          filterThirdMonthEmployees(thirdMonthEmployees);
        setThirdMonthEmp(filtered3rdMonthEmp);
        const filtered5thMonthEmp =
          filterFifthMonthEmployees(fifthMonthEmployees);
        setFifthMonthEmp(filtered5thMonthEmp);

        console.log("filter 3rd month emps: ", filtered3rdMonthEmp);
        console.log("filter 5th month emps: ", filtered5thMonthEmp);
      } catch (error) {
        console.error(
          "Error fetching third month probationary employees:",
          error
        );
      }
    };
    fetchProbationaryEmp();
  }, []);

  console.log("third month emps: ", thirdMonthEmp);
  console.log("fifth month emps: ", fifthMonthEmp);

  const abbreviateDept = (deptName) => {
    if (!deptName) {
      return "";
    }

    const commonWords = ["of", "and"];
    const words = deptName.split(" ");

    if (words.length < 2) {
      return deptName;
    }

    return words
      .filter((word) => !commonWords.includes(word.toLowerCase()))
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const handlePieMonthChange = (event) => {
    setPieMonth(event.target.value);
  };

  //pie chart
  const [pieChartData, setPieChartData] = useState({
    series: pieData[pieMonth],
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: ["Pending", "In Progress", "Completed"],
      legend: {
        position: "bottom",
      },
      colors: ["#636E72", "#F8C702", "#8c383e"],
    },
  });

  const [evalStatuses, setEvalStatuses] = useState([]);
  const [filtered3rdEvalStats, setFiltered3rdEvalStats] = useState([]);
  const [filtered5thEvalStats, setFiltered5thEvalStats] = useState([]);

  //fetch user evaluations statuses
  useEffect(() => {
    const fetchEvalStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}evaluation/evaluations`);

        setEvalStatuses(response.data);
      } catch (error) {
        console.log("Error fetching user evaluation statuses: ", error);
      }
    };

    fetchEvalStatus();
  }, [thirdMonthEmp, fifthMonthEmp]);

  //console.log("Eval statuses: ", evalStatuses);
  useEffect(() => {
    const filterStatsByMonth = () => {
      const thirdMonthFiltered = evalStatuses.filter((status) =>
        thirdMonthEmp.some((emp) => emp.userID === status.userId)
      );
      const fifthMonthFiltered = evalStatuses.filter((status) =>
        fifthMonthEmp.some((emp) => emp.userID === status.userId)
      );

      setFiltered3rdEvalStats(thirdMonthFiltered);
      setFiltered5thEvalStats(fifthMonthFiltered);
    };

    filterStatsByMonth();
  }, [evalStatuses, thirdMonthEmp, fifthMonthEmp]);

  // console.log("filtered third eval emps stats: ", filtered3rdEvalStats);
  // console.log("Count of third eval emps: ", thirdMonthEmp.length);

  // function to count pending user objects
  const countPendingUsers = (users) =>
    users.reduce((count, user) => {
      const statuses = [
        user.sjbpStatus,
        user.svbpaStatus,
        user.pvbpaStatus,
        user.hjbpStatus,
        user.hvbpaStatus,
      ];

      return statuses.every((status) => !status || status === "PENDING")
        ? count + 1
        : count;
    }, 0);

  // Function to count completed user objects
  const countCompletedUsers = (users) => {
    return users.reduce((count, user) => {
      const isCompleted =
        user.sjbpStatus === "COMPLETED" &&
        user.svbpaStatus === "COMPLETED" &&
        user.pvbpaStatus === "COMPLETED" &&
        user.hjbpStatus === "COMPLETED" &&
        user.hvbpaStatus === "COMPLETED";

      return isCompleted ? count + 1 : count;
    }, 0);
  };

  // Function to count "In-Progress" user objects
  const countInProgressUsers = (users) => {
    return users.reduce((count, user) => {
      const statuses = [
        user.sjbpStatus,
        user.svbpaStatus,
        user.pvbpaStatus,
        user.hjbpStatus,
        user.hvbpaStatus,
      ];

      const hasAtLeastOneCompleted = statuses.includes("COMPLETED");
      const isNotFullyCompleted = statuses.some(
        (status) => status !== "COMPLETED" && status !== null
      );

      return hasAtLeastOneCompleted && isNotFullyCompleted ? count + 1 : count;
    }, 0);
  };

  useEffect(() => {
    setPieData({
      "3rd Month": [
        thirdMonthEmp.length - countInProgressUsers(filtered3rdEvalStats),
        countInProgressUsers(filtered3rdEvalStats),
        countCompletedUsers(filtered3rdEvalStats),
      ],
      "5th Month": [
        fifthMonthEmp.length - countInProgressUsers(filtered5thEvalStats),
        countInProgressUsers(filtered5thEvalStats),
        countCompletedUsers(filtered5thEvalStats),
      ],
    });
  }, [filtered3rdEvalStats, filtered5thEvalStats]);

  // Update the pie chart data when the month changes
  useEffect(() => {
    setPieChartData((prevState) => ({
      ...prevState,
      series: pieData[pieMonth],
    }));
  }, [pieMonth, pieData]);

  const empPieCount =
    pieMonth === "3rd Month" ? thirdMonthEmp.length : fifthMonthEmp.length;

  //line chart
  const [lineChartData, setLineChartData] = useState({
    series: [
      {
        name: "Regular Staff",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#F8C702"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      // title: {
      //   text: "Product Trends by Month",
      //   align: "left",
      // },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // alternating row colors
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      fill: {
        type: "solid",
        colors: ["#96CEB4"],
      },
    },
  });

  //line chart useEffect
  useEffect(() => {
    const fetchRegEmpCountData = async () => {
      try {
        const response = await axios.get(`${apiUrl}regEmpCount/getAllByYear`, {
          params: {
            year: currentYear,
          },
        });

        const empCounts = response.data.map((item) => item.regularEmpCount);

        setLineChartData((prevData) => ({
          ...prevData,
          series: [{ ...prevData.series[0], data: empCounts }],
        }));
      } catch (error) {
        console.error("Error fetching regular employee counts:", error);
      }
    };

    if (currentYear) {
      fetchRegEmpCountData();
    }
  }, [currentYear]);

  const [deptArray, setDeptArray] = useState([]);

  //column chart
  const [columnChartData, setColumnChartData] = useState({
    series: [
      {
        name: "3rd Month",
        data: [10, 7, 5, 12, 6, 10, 4, 6], // Example data for 3rd Month
      },
      {
        name: "5th Month",
        data: [5, 3, 4, 6, 3, 4, 2, 4], // Example data for 5th Month
      },
      {
        name: "Regular",
        data: [15, 18, 12, 17, 20, 15, 16, 13], // Example data for Regular
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%", // Adjust width of columns
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [], // Department categories
      },
      yaxis: {
        // title: {
        //   text: "Employee Count",
        // },
      },
      fill: {
        opacity: 1,
        colors: ["#8c383e", "#636E72", "#F8C702"], // Match your colors for each series
      },
      colors: ["#8c383e", "#636E72", "#F8C702"],
      legend: {
        position: "top", // Legend position
        horizontalAlign: "center",
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " employees"; // Customize tooltip
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchDepartmentNamesAndCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}department/getAllDeptNames`);
        const departmentNames = response.data;
        setDeptArray(departmentNames);

        // Fetch employee counts by departments
        const countsResponse = await axios.get(
          `${apiUrl}user/counts-by-departments`,
          {
            params: {
              departments: departmentNames.join(","),
            },
          }
        );
        const countsData = countsResponse.data;

        const seriesData = {
          "3rd Month": [],
          "5th Month": [],
          Regular: [],
        };

        countsData.forEach((dept) => {
          seriesData["3rd Month"].push(dept.countOf3MonthProbe);
          seriesData["5th Month"].push(dept.countOf5MonthProbe);
          seriesData["Regular"].push(dept.countOfRegEmp);
        });

        const abbreviatedNames = departmentNames.map(abbreviateDept);

        setColumnChartData((prevData) => ({
          ...prevData,
          series: [
            { name: "3rd Month", data: seriesData["3rd Month"] },
            { name: "5th Month", data: seriesData["5th Month"] },
            { name: "Regular", data: seriesData["Regular"] },
          ],
          options: {
            ...prevData.options,
            xaxis: {
              categories: abbreviatedNames,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching department names:", error);
      }
    };

    fetchDepartmentNamesAndCount();
  }, []);

  const handleOpenEditView = () => {
    setOpenEditView(true);
  };

  const handleCloseEditView = () => {
    setOpenEditView(false);
  };

  const handleOpenSYModal = () => {
    setOpenSYModal(true);
  };

  const handleCloseSYModal = () => {
    setOpenSYModal(false);
    setIsOpenView(false);
    setOpenEditView(false);
  };

  const handleOpenView = () => {
    setIsOpenView(true);
  };

  const handleCloseView = () => {
    setIsOpenView(false);
    setOpenEditView(false);
  };

  const handleOpenAddSY = () => {
    setOpenAddSY(true);
  };

  const handleCloseAddSY = () => {
    setOpenAddSY(false);
    setOpenEditView(false);
  };

  return (
    <Animated>
      <div style={{ minHeight: "91vh" }}>
        <div
          style={{
            height: "9vh",
            width: "100%",
            padding: "0px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            //backgroundColor: "lightyellow",
          }}
        >
          <Typography variant="h5" fontWeight="bolder" fontFamily="Poppins">
            Dashboard
          </Typography>
          <Button
            onClick={handleOpenSYModal}
            sx={{
              width: "12%",
              backgroundColor: "#8C383E",
              "&:hover": {
                backgroundColor: "#8c383e",
              },
              fontFamily: "poppins",
            }}
            variant="contained"
          >
            Manage S.Y.
          </Button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div
            style={{
              height: "82vh",
              width: "95%",
              //backgroundColor: "tomato",
              margin: "auto",
              overflowX: "scroll",
            }}
          >
            {/** 1st part */}
            <div
              style={{
                height: "45vh",
                width: "99%",
                //backgroundColor: "lightgreen",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/** Employee Counts */}
              <div
                style={{
                  height: "100%",
                  width: "19%",
                  //backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    height: "31%",
                    width: "100%",
                    backgroundColor: "#8c383e",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        height: "30%",
                        fontWeight: "500",
                        color: "white",
                        fontSize: "15px",
                      }}
                    >
                      <h3>3rd Month Probationaries</h3>
                    </div>

                    <div
                      style={{
                        height: "60%",
                        //backgroundColor: "lightsteelblue",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "40px",
                          fontWeight: "bolder",
                          color: "white",
                        }}
                      >
                        {thirdMonthEmpCount}
                      </p>
                      <FontAwesomeIcon
                        icon={faSeedling}
                        style={{ fontSize: "25px", color: "white" }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "31%",
                    width: "100%",
                    backgroundColor: "#808080",
                    //backgroundColor: "#FFEEAD",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        height: "30%",
                        fontWeight: "500",
                        color: "white",
                        fontSize: "15px",
                      }}
                    >
                      <h3>5th Month Probationaries</h3>
                    </div>

                    <div
                      style={{
                        height: "60%",
                        //backgroundColor: "lightsteelblue",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "40px",
                          fontWeight: "bolder",
                          color: "white",
                        }}
                      >
                        {fifthMonthEmpCount}
                      </p>
                      <FontAwesomeIcon
                        icon={faHandshake}
                        style={{ fontSize: "25px", color: "white" }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "31%",
                    width: "100%",
                    backgroundColor: "#F8C702",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      color: "#333333",
                    }}
                  >
                    <div style={{ height: "30%", fontWeight: "500" }}>
                      <h3>Regular Staff</h3>
                    </div>

                    <div
                      style={{
                        height: "60%",
                        //backgroundColor: "lightsteelblue",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontSize: "40px", fontWeight: "bolder" }}>
                        {regEmpCount}
                      </p>
                      <FontAwesomeIcon
                        icon={faUsers}
                        style={{ fontSize: "25px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/** Total Employee Graph */}
              <div
                style={{
                  height: "100%",
                  width: "44%",
                  //backgroundColor: "lightgray",
                }}
              >
                <div
                  id="line-chart"
                  style={{
                    backgroundColor: "white",
                    width: "100%",

                    borderRadius: "10px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <h1
                    style={{
                      backgroundColor: "#F8C702",
                      borderRadius: "10px 10px 0px 0px",
                      padding: "5px 15px",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                  >
                    Total Regular Staff
                  </h1>
                  <div style={{ padding: "0px 10px 0pc 0pc" }}>
                    <ReactApexChart
                      options={lineChartData.options}
                      series={lineChartData.series}
                      type="line"
                      height={280}
                    />
                  </div>
                </div>
              </div>
              {/** Employee Evaluation Pie Chart */}
              <div
                style={{
                  height: "100%",
                  width: "34%",
                  //backgroundColor: "lightcyan",
                  //marginRight: "10px",
                  boxShadow:
                    "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                }}
              >
                <div
                  id="pie-chart"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    borderRadius: "10px",
                    backgroundColor: "white",
                    padding: "15px",
                  }}
                >
                  <div
                    style={{
                      //backgroundColor: "yellow",
                      display: "flex",
                      width: "99%",
                      margin: "auto",
                      justifyContent: "space-between",
                      alignItems: "center",
                      //padding: "5px",
                    }}
                  >
                    <p style={{ fontSize: "13px" }}>
                      Staff count: {empPieCount}
                    </p>
                    <select
                      value={pieMonth}
                      onChange={handlePieMonthChange}
                      style={{
                        border: "2px solid #636E72",
                        borderRadius: "5px",
                      }}
                    >
                      <option value="3rd Month">3rd Month</option>
                      <option value="5th Month">5th Month</option>
                      {/* Add more months as needed */}
                    </select>
                  </div>

                  {empPieCount === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUsersSlash}
                        style={{ fontSize: "25px", color: "#808080" }}
                      />
                      <p
                        style={{
                          color: "#808080",
                          fontSize: "14px",
                          paddingTop: "15px",
                        }}
                      >
                        No staff found
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <ReactApexChart
                        options={pieChartData.options}
                        series={pieChartData.series}
                        type="donut"
                        height={300}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/** 2nd part */}
            <div
              style={{
                //backgroundColor: "#7E60BF",
                height: "55vh",
                width: "99%",
                display: "flex",
                alignItems: "end",
              }}
            >
              <div
                style={{
                  height: "93%",
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  paddingTop: "15px",
                  boxShadow:
                    "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                }}
              >
                <div id="chart">
                  <ReactApexChart
                    options={columnChartData.options}
                    series={columnChartData.series}
                    type="bar"
                    height={330}
                  />
                </div>
              </div>
            </div>

            {/** Third part */}
            <div
              style={{
                //backgroundColor: "#E4B1F0",
                height: "45vh",
                width: "99%",
                display: "flex",
                alignItems: "end",
              }}
            >
              <div
                style={{
                  height: "93%",
                  width: "100%",
                  //backgroundColor: "white",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "49%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <h2
                    style={{
                      backgroundColor: "#8c383e",
                      borderRadius: "10px 10px 0px 0px",
                      padding: "5px 15px",
                      fontWeight: "500",
                      fontSize: "16px",
                      height: "4.5vh",
                      color: "white",
                    }}
                  >
                    3rd Month Probationary Employee for This Month
                  </h2>
                  <div
                    style={{
                      //backgroundColor: "lavender",
                      height: "89.5%",
                      width: "99%",
                      borderRadius: "0px 0px 10px 10px",
                      overflowX: "scroll",
                    }}
                  >
                    {/** labels */}
                    <div
                      style={{
                        backgroundColor: "white",
                        //padding: "5px 15px",
                        height: "5vh",
                        width: "95%",
                        margin: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#636E72",
                        //borderBottom: "1px solid #A9A9A9",
                        fontSize: "13px",
                        fontWeight: "500",
                        marginTop: "5px",
                        position: "sticky",
                        top: 0,
                      }}
                    >
                      <p
                        style={{
                          //backgroundColor: "tomato",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Employee Name
                      </p>
                      <p
                        style={{
                          //backgroundColor: "lightgreen",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Department
                      </p>
                      <p
                        style={{
                          //backgroundColor: "lightcoral",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Position
                      </p>
                    </div>
                    {/** users data */}
                    {thirdMonthEmp.length > 0 ? (
                      thirdMonthEmp.map((user) => {
                        return (
                          <div
                            style={{
                              //backgroundColor: "#FFAD60",
                              //padding: "5px 15px",
                              fontWeight: "500",

                              height: "5vh",
                              width: "95%",
                              margin: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "#636E72",
                              borderBottom: "1px solid #A9A9A9",
                              fontSize: "12px",
                            }}
                          >
                            <p
                              style={{
                                //backgroundColor: "tomato",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                  fontSize: "13px",
                                  marginRight: "10px",
                                }}
                              />
                              {user.fName} {user.lName}
                            </p>
                            <p
                              style={{
                                //backgroundColor: "lightgreen",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              {abbreviateDept(user.dept)}
                            </p>
                            <p
                              style={{
                                //backgroundColor: "lightcoral",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              {user.position}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          //backgroundColor: "lightpink",
                          height: "45%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <p style={{ fontSize: "13px", color: "#636E72" }}>
                          There are no 3rd month probationary staff for this
                          month.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    height: "100%",
                    width: "49%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow:
                      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <h2
                    style={{
                      backgroundColor: "#808080",
                      borderRadius: "10px 10px 0px 0px",
                      padding: "5px 15px",
                      fontWeight: "500",
                      fontSize: "16px",
                      height: "4.5vh",
                      color: "white",
                    }}
                  >
                    5th Month Probationary Employee for This Month
                  </h2>
                  <div
                    style={{
                      //backgroundColor: "lavender",
                      height: "89.5%",
                      width: "99%",
                      borderRadius: "0px 0px 10px 10px",
                      overflowX: "scroll",
                    }}
                  >
                    {/** labels */}
                    <div
                      style={{
                        backgroundColor: "white",
                        //padding: "5px 15px",

                        height: "5vh",
                        width: "95%",
                        margin: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#636E72",
                        //borderBottom: "1px solid #A9A9A9",
                        fontSize: "13px",
                        fontWeight: "500",
                        marginTop: "5px",
                        position: "sticky",
                        top: 0,
                      }}
                    >
                      <p
                        style={{
                          //backgroundColor: "tomato",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Employee Name
                      </p>
                      <p
                        style={{
                          //backgroundColor: "lightgreen",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Department
                      </p>
                      <p
                        style={{
                          //backgroundColor: "lightcoral",
                          flex: 2,
                          paddingLeft: "15px",
                        }}
                      >
                        Position
                      </p>
                    </div>
                    {/** users data */}
                    {fifthMonthEmp.length > 0 ? (
                      fifthMonthEmp.map((user) => {
                        return (
                          <div
                            style={{
                              //backgroundColor: "#FFAD60",
                              //padding: "5px 15px",
                              fontWeight: "500",

                              height: "5vh",
                              width: "95%",
                              margin: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "#636E72",
                              borderBottom: "1px solid #A9A9A9",
                              fontSize: "12px",
                            }}
                          >
                            <p
                              style={{
                                //backgroundColor: "tomato",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                  fontSize: "13px",
                                  marginRight: "10px",
                                }}
                              />
                              {user.fName} {user.lName}
                            </p>
                            <p
                              style={{
                                //backgroundColor: "lightgreen",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              {abbreviateDept(user.dept)}
                            </p>
                            <p
                              style={{
                                //backgroundColor: "lightcoral",
                                flex: 2,
                                paddingLeft: "15px",
                              }}
                            >
                              {user.position}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          //backgroundColor: "lightpink",
                          height: "45%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <p style={{ fontSize: "13px", color: "#636E72" }}>
                          There are no 5th month probationary staff for this
                          month.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <SchoolYearModal
                  openModal={openSYModal}
                  handleCloseModal={handleCloseSYModal}
                  isOpenView={isOpenView}
                  handleOpenView={handleOpenView}
                  handleCloseView={handleCloseView}
                  openAddSY={openAddSY}
                  setOpenAddSY={setOpenAddSY}
                  handleOpenAddSY={handleOpenAddSY}
                  handleCloseAddSY={handleCloseAddSY}
                  openEditView={openEditView}
                  handleOpenEditView={handleOpenEditView}
                  handleCloseEditView={handleCloseEditView}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Animated>
  );
}

export default AdminDashboard;
