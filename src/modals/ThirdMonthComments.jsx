import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import axios from "axios";

const ThirdMonthComments = () => {
  const role = sessionStorage.getItem("userRole");
  console.log("Role:", role);
  const userId = sessionStorage.getItem("userID");
  const [department, setDepartment] = useState("");
  const [fullname, setFullname] = useState("");
  const [position, setPosition] = useState("");
  const [headFullname, setHeadFullname] = useState("");
  const [headPosition, setHeadPosition] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/getUser/${userId}`
        );
        setDepartment(response.data.dept);
        setFullname(response.data.fName + " " + response.data.lName);
        setPosition(response.data.position);
      } catch (error) {
        console.error("Error checking evaluation status:", error);
      }
    };

    fetchUserData();
  }, []);


  // Fetch head of department data
  useEffect(() => {
    const fetchHeadData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getAllUser`);
        const users = response.data;

        const head = users.find(
          (user) =>
            user.dept === department &&
            user.position === "Department Head"
        );

        if (head) {
          setHeadFullname(`${head.fName} ${head.lName}`);
          setHeadPosition(head.position);
        }
      } catch (error) {
        console.error("Error fetching department head data:", error);
      }
    };

    if (department) {
      fetchHeadData();
    }
  }, [department]);

  return (
    <div>
      <Box
        className="mb-2 mt-14"
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
        Inputs from Immediate Head or Designated Supervisor
      </Box>
      {/* [GAP] */}
      <Typography
        sx={{
          backgroundColor: "black",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          height: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {" "}
        &nbsp; [GAP] Describe areas you feel require improvement in terms of
        your STAFF's professional capabilities.{" "}
      </Typography>

      <div className="flex space-x-4 -mt-2">
        <TextField
          disabled={role === "EMPLOYEE"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </div>
      {/* [TARGET]  */}
      <Typography
        sx={{
          backgroundColor: "black",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          height: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {" "}
        &nbsp; [TARGET] What should be your STAFF's career goals for the
        semester (up to December 2024)?{" "}
      </Typography>

      <div className="flex space-x-4 -mt-2">
        <TextField
          disabled={role === "EMPLOYEE"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </div>
      {/* [ACTION/S] */}
      <Typography
        sx={{
          backgroundColor: "black",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          height: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {" "}
        &nbsp; [ACTION/S] What could your STAFF, you as Immediate Head or CIT
        management do to best support your STAFF in accomplishing these goals?{" "}
      </Typography>

      <div className="flex space-x-4 -mt-2 mb-8">
        <TextField
          disabled={role === "EMPLOYEE"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </div>

      {/* SUPPLEMENTARY NOTES */}
      <Typography
        sx={{
          backgroundColor: "#EAB4CF",
          fontSize: "1rem",
          fontWeight: "bold",
          height: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {" "}
        &nbsp; SUPPLEMENTARY NOTES / COMMENTS / REMINDERS{" "}
      </Typography>

      <div className="flex space-x-4 -mt-2">
        <TextField
          disabled={role === "EMPLOYEE"}
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          margin="normal"
        />
      </div>
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
                {fullname}
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
                {position}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdMonthComments;
