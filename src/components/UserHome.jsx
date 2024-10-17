import React, { useEffect, useState } from "react";
import axios from "axios";
import imageSources from "../data/imageSource";
import evaluate from "../assets/evaluate.png";
import select from "../assets/select.png";
import done from "../assets/done.png";
import ManageAccoount from "../assets/ManageAccount.png";
import ManageOffice from "../assets/ManageOffice.png";
import ManageEmployee from "../assets/ManageEmployee.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { apiUrl } from "../config/config";

function UserHome() {
  const [loggedUserData, setLoggedUserData] = useState({});
  const userID = sessionStorage.getItem("userID");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/getUser/${userID}`);
        setLoggedUserData(response.data);
        console.log(userID);
        console.log(response.data);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageSources.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDepartmentStaff = async () => {
      try {
        const response = await axios.get(`${apiUrl}user/getAllUser`);
        setAllUser(response.data);
        console.log("All users: " + response.data);
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

    fetchDepartmentStaff();
  }, []);

  function base64ToDataURL(base64String) {
    return `data:image/png;base64,${base64String}`;
  }

  const filteredDeptStaff = allUser
    .filter((user) => user.dept === loggedUserData.dept && user.isDeleted === 0)
    .sort((a, b) => {
      if (a.role === "HEAD") return -1;
      if (b.role === "HEAD") return 1;
      if (a.position === "Secretary") return -1;
      if (b.position === "Secretary") return 1;
      return 0;
    });

  const filteredAdmins = allUser
    .filter(
      (user) =>
        user.role === "ADMIN" ||
        (user.role === "SUPERUSER" && user.isDeleted === 0)
    )
    .sort((a, b) => {
      if (a.role === "SUPERUSER") return -1;
      if (b.role === "SUPERUSER") return 1;
      if (a.position === "ADMIN") return -1;
      if (b.position === "ADMIN") return 1;
      return 0;
    });

  const container = {
    //backgroundColor: "tomato",
    height: "100%",
    padding: "10px 25px 0px 25px",
    overflow: "auto",
  };

  const carouselContainer = {
    height: "240px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "red",
    marginTop: "10px",
    overflow: "hidden",
    borderRadius: "10px",
  };

  const howTocardStyles = {
    height: "100%",
    width: "31%",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "start",
    boxShadow:
      "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
  };

  return (
    <div style={container}>
      {/** Welcome and Calendar/Status  */}
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          height: "43vh",
          width: "100%",
          //backgroundColor: "lavender",
        }}
      >
        <div
          style={{
            //backgroundColor: "lavender",
            width: "75%",
            height: "100%",
            padding: "0px 0px 0px 0px",
          }}
        >
          <div
            style={{
              borderRadius: "8px",
              width: "98%",
              minHeight: "100%",
              backgroundColor: "white",
              padding: "15px",
              boxShadow:
                "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              Welcome back, {loggedUserData.fName}
            </h1>

            <div style={carouselContainer}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imageSources[currentImageIndex].src}
                  alt={imageSources[currentImageIndex].alt}
                  style={{
                    width: imageSources[currentImageIndex].width,
                    height: "100%",
                    margin: imageSources[currentImageIndex].margin,
                    objectFit: imageSources[currentImageIndex].objectFit,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            //backgroundColor: "lightgreen",
            width: "25%",
            height: "100%",
          }}
        >
          <div
            style={{
              //backgroundColor: "aqua",
              height: "100%",
              width: "100%",
            }}
          >
            <div
              className="card flex justify-content-center"
              style={{
                backgroundColor: "white",
                height: "100%",
                width: "100%",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                boxShadow:
                  "0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.12)",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </div>

      {/** How to & Dept */}
      <div
        style={{
          display: "flex",
          height: "43vh",
          width: "100%",
          //backgroundColor: "lightyellow",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "75%",
            fontSize: "15px",
            //backgroundColor: "lavender",
            //paddingTop: "10px",
          }}
        >
          <h1 style={{ marginTop: "10px", fontSize: "20px", fontWeight: 600 }}>
            {loggedUserData.role === "ADMIN" ||
            loggedUserData.role === "SUPERUSER"
              ? "How to use:"
              : "How to Evaluate:"}
          </h1>
          <div
            style={{
              height: "85%",
              width: "98%",
              //backgroundColor: "lightyellow",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={howTocardStyles}>
              {loggedUserData.role === "ADMIN" ||
              loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    //backgroundColor: "tomato",
                    height: "40%",
                  }}
                >
                  <img
                    src={ManageAccoount}
                    alt="Step 1"
                    style={{ width: "50%" }}
                  />
                </div>
              ) : (
                <img src={evaluate} alt="Step 1" style={{ width: "50%" }} />
              )}
              {loggedUserData.role === "EMPLOYEE" ? (
                <p style={{ textAlign: "center" }}>
                  Navigate to the Take Evaluation page.
                </p>
              ) : loggedUserData.role === "HEAD" ? (
                <p style={{ textAlign: "center" }}>
                  Navigate to the Staff Evaluation page.
                </p>
              ) : loggedUserData.role === "ADMIN" ||
                loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    //backgroundColor: "lightgreen",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: "500",
                      color: "#F8C702",
                    }}
                  >
                    Manage Account
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "2",
                      textAlign: "center",
                    }}
                  >
                    The Manage Account feature lets you create, update, and
                    delete employee accounts, making it easy to manage employee
                    information.
                  </p>
                </div>
              ) : null}
            </div>
            <div style={howTocardStyles}>
              {loggedUserData.role === "ADMIN" ||
              loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    //backgroundColor: "tomato",
                    height: "40%",
                  }}
                >
                  <img
                    src={ManageOffice}
                    alt="Step 1"
                    style={{ width: "35%" }}
                  />
                </div>
              ) : (
                <img src={select} alt="Step 2" style={{ width: "50%" }} />
              )}
              {loggedUserData.role === "EMPLOYEE" ? (
                <p style={{ textAlign: "center" }}>
                  You may opt to select Self or Peer Evaluation. You can decide
                  which response to provide first.
                </p>
              ) : loggedUserData.role === "HEAD" ? (
                <p style={{ textAlign: "center" }}>
                  Select a staff member to evaluate. There are two types of
                  evaluations: Values-based and Job-based.
                </p>
              ) : loggedUserData.role === "ADMIN" ||
                loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    //backgroundColor: "lightgreen",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: "500",
                      color: "#F8C702",
                    }}
                  >
                    Manage Offices
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "2",
                      marginTop: "8px",
                      textAlign: "center",
                    }}
                  >
                    The Manage Offices feature allows you to create, update, and
                    delete Offices, as well as assign Office heads.
                  </p>
                </div>
              ) : null}
            </div>
            <div style={howTocardStyles}>
              {loggedUserData.role === "ADMIN" ||
              loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    //backgroundColor: "tomato",
                    height: "40%",
                  }}
                >
                  <img
                    src={ManageEmployee}
                    alt="Step 1"
                    style={{ width: "35%" }}
                  />
                </div>
              ) : (
                <img src={done} alt="Step 3" style={{ width: "50%" }} />
              )}
              {loggedUserData.role === "EMPLOYEE" ? (
                <p style={{ textAlign: "center" }}>
                  Make sure that every field is filled out correctly, then send
                  in your assessment. This concludes your participation.
                </p>
              ) : loggedUserData.role === "HEAD" ? (
                <p style={{ textAlign: "center" }}>
                  Ensure that every field is filled out correctly, then submit
                  your assessment. This concludes the staff evaluation process.
                </p>
              ) : loggedUserData.role === "ADMIN" ||
                loggedUserData.role === "SUPERUSER" ? (
                <div
                  style={{
                    //backgroundColor: "lightgreen",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: "500",
                      color: "#F8C702",
                    }}
                  >
                    Manage Employee
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "2",
                      marginTop: "8px",
                      textAlign: "center",
                    }}
                  >
                    The Manage Employee feature lets you track employee
                    regularization and evaluation status, ensuring easy
                    monitoring of their progress.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div
          style={{
            height: "43vh",
            width: "25%",
            //backgroundColor: "lightpink",
          }}
        >
          <h1 style={{ marginTop: "10px", fontSize: "20px", fontWeight: 600 }}>
            {loggedUserData.role === "ADMIN" ||
            loggedUserData.role === "SUPERUSER"
              ? "Admins:"
              : "Department:"}
          </h1>
          <div
            style={{
              marginTop: "7px",
              //backgroundColor: "white",
              height: "85%",
              paddingTop: "10px",
              overflow: "hidden",
              overflowY: "auto",
            }}
          >
            {loggedUserData.role === "ADMIN" ||
            loggedUserData.role === "SUPERUSER" ? (
              <ul>
                {filteredAdmins.map((staff, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        height: "50px",
                        width: "100%",
                        //backgroundColor: "yellow",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          //border: "1px solid black",
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            height: "100%",
                          }}
                          src={
                            staff?.profilePic
                              ? base64ToDataURL(staff.profilePic)
                              : null
                          }
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "15px",
                          height: "50px",
                          //backgroundColor: "lightblue",
                          width: "70%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <h1>
                          {staff.fName} {staff.lName}
                        </h1>
                        <p>{staff.position}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul>
                {filteredDeptStaff.map((staff, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        height: "50px",
                        width: "100%",
                        //backgroundColor: "yellow",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          //border: "1px solid black",
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            height: "100%",
                          }}
                          src={
                            staff?.profilePic
                              ? base64ToDataURL(staff.profilePic)
                              : null
                          }
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "15px",
                          height: "50px",
                          //backgroundColor: "lightblue",
                          width: "70%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <h1>
                          {staff.fName} {staff.lName}
                        </h1>
                        <p>{staff.position}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
