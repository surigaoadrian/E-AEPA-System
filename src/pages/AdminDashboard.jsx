import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Box, Grid, Typography, Paper, Container } from "@mui/material";
import EvaluationStatusChart from "../components/EvaluationStatusChart";
import EmployeeStatusChart from "../components/EmployeeStatusChart";
import AccomplishmentRateChart from "../components/AccomplishmentRateChart";
import ThirdMonthCompletion from "../components/ThirdMonthCompletion";
import FifthMonthCompletion from "../components/FifthMonthCompletion";
import AnnualCompletion from "../components/AnnualCompletion";
import SchoolYearModal from "../modals/SchoolYearModal";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faHandshake,
  faUsers,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";

function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, "MMMM dd, yyyy | EEEE");
    setCurrentDate(formattedDate);
  }, []);

  //adi codes
  const [openSYModal, setOpenSYModal] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [openAddSY, setOpenAddSY] = useState(false);
  const [openEditView, setOpenEditView] = useState(false);

  const [month, setMonth] = useState("3rd Month");
  const data = {
    "3rd Month": [17, 30, 53],
    "5th Month": [20, 25, 55],
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  //pie chart
  const [pieChartData, setPieChartData] = useState({
    series: data[month], // Use the data for the selected month
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: ["Pending", "In Progress", "Completed"],
      legend: {
        position: "bottom",
      },
      colors: ["#636E72", "#F8C702", "#7C2828"],
    },
  });

  // Update the pie chart data when the month changes
  useEffect(() => {
    setPieChartData((prevState) => ({
      ...prevState,
      series: data[month], // Update series based on selected month
    }));
  }, [month]);

  //line chart
  const [lineChartData] = useState({
    series: [
      {
        name: "Desktops",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 85, 95, 100],
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

  //column chart
  const [chartData] = useState({
    series: [
      {
        name: "3rd Month",
        data: [10, 7, 5, 12, 6, 10, 4, 6, 5, 8, 3, 2, 5, 6, 3], // Example data for 3rd Month
      },
      {
        name: "5th Month",
        data: [5, 3, 4, 6, 3, 4, 2, 4, 3, 4, 1, 1, 2, 3, 1], // Example data for 5th Month
      },
      {
        name: "Regular",
        data: [15, 18, 12, 17, 20, 15, 16, 13, 17, 19, 12, 15, 18, 14, 20], // Example data for Regular
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
        categories: [
          "HR",
          "TSG",
          "QAO",
          "ETO",
          "MIS",
          "Finance",
          "IMDC",
          "Guidance",
          "TSG",
          "MSDO",
          "WIL",
          "OAS",
          "SAO",
          "Makerspace",
          "CES",
        ], // Department categories
      },
      yaxis: {
        // title: {
        //   text: "Employee Count",
        // },
      },
      fill: {
        opacity: 1,
        colors: ["#7C2828", "#636E72", "#F8C702"], // Match your colors for each series
      },
      colors: ["#7C2828", "#636E72", "#F8C702"],
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
        {/* <Typography variant="h7" fontFamily="Poppins">{currentDate}</Typography> */}
        <Button
          onClick={handleOpenSYModal}
          sx={{
            width: "12%",
            backgroundColor: "#8C383E",
            "&:hover": {
              backgroundColor: "#7C2828",
            },
            fontFamily: "poppins",
          }}
          variant="contained"
        >
          Manage S.Y.
        </Button>
      </div>

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
                backgroundColor: "#7C2828",
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
                  style={{ height: "30%", fontWeight: "500", color: "white" }}
                >
                  <h3>3rd Month Employees</h3>
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
                    13
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
                backgroundColor: "#636E72",
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
                  style={{ height: "30%", fontWeight: "500", color: "white" }}
                >
                  <h3>5th Month Employees</h3>
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
                    10
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
                  <h3>Regular Employees</h3>
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
                  <p style={{ fontSize: "40px", fontWeight: "bolder" }}>256</p>
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
                Total Regular Employees
              </h1>
              <ReactApexChart
                options={lineChartData.options}
                series={lineChartData.series}
                type="line"
                height={280}
              />
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
                padding: "10px",
              }}
            >
              <div
                style={{
                  //backgroundColor: "yellow",
                  display: "flex",
                  justifyContent: "end",
                  //padding: "5px",
                }}
              >
                <select
                  value={month}
                  onChange={handleMonthChange}
                  style={{ border: "2px solid #636E72", borderRadius: "5px" }}
                >
                  <option value="3rd Month">3rd Month</option>
                  <option value="5th Month">5th Month</option>
                  {/* Add more months as needed */}
                </select>
              </div>

              <ReactApexChart
                options={pieChartData.options}
                series={pieChartData.series}
                type="donut"
                height={300}
              />
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
                options={chartData.options}
                series={chartData.series}
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
                  backgroundColor: "#7C2828",
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
                    fontWeight: "500",
                    fontSize: "16px",
                    height: "5vh",
                    width: "95%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#636E72",
                    //borderBottom: "1px solid #A9A9A9",
                    fontSize: "14px",
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
                    fontSize: "14px",
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
                      style={{ fontSize: "13px", marginRight: "10px" }}
                    />
                    John Doe
                  </p>
                  <p
                    style={{
                      //backgroundColor: "lightgreen",
                      flex: 2,
                      paddingLeft: "15px",
                    }}
                  >
                    MIS
                  </p>
                  <p
                    style={{
                      //backgroundColor: "lightcoral",
                      flex: 2,
                      paddingLeft: "15px",
                    }}
                  >
                    Programmer
                  </p>
                </div>
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
                  backgroundColor: "#636E72",
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
                    fontWeight: "500",
                    fontSize: "16px",
                    height: "5vh",
                    width: "95%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#636E72",
                    //borderBottom: "1px solid #A9A9A9",
                    fontSize: "14px",
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
                    fontSize: "14px",
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
                      style={{ fontSize: "13px", marginRight: "10px" }}
                    />
                    John Doe
                  </p>
                  <p
                    style={{
                      //backgroundColor: "lightgreen",
                      flex: 2,
                      paddingLeft: "15px",
                    }}
                  >
                    MIS
                  </p>
                  <p
                    style={{
                      //backgroundColor: "lightcoral",
                      flex: 2,
                      paddingLeft: "15px",
                    }}
                  >
                    Programmer
                  </p>
                </div>
              </div>
            </div>
            {/* <div
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
                  backgroundColor: "#FFEEAD",
                  borderRadius: "10px 10px 0px 0px",
                  padding: "5px 15px",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
              >
                5th-Month Probationary Employee for This Month
              </h2>
            </div> */}
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
    </div>
  );
}

export default AdminDashboard;
