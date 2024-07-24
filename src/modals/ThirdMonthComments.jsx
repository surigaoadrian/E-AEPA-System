import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import axios from "axios";

const ThirdMonthComments = ({ userId, fName, lName, pos}) => {
  const role = sessionStorage.getItem("userRole");
  console.log("Role:", role);
  
  const [department, setDepartment] = useState("");
  const [headFullname, setHeadFullname] = useState("");
  const [headPosition, setHeadPosition] = useState("");


  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getUser/${userId}`);
        const user = response.data;
        console.log("User data:", user);
        setDepartment(user.dept); // Ensure this matches your data structure
      } catch (error) {
        console.error("Error fetching user department:", error);
      }
    };

    fetchUserDepartment();
  }, [userId]);

  // Fetch head of department data
  useEffect(() => {
    const fetchHeadData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getAllUser`);
        const users = response.data;
  
        // Log fetched users
        console.log("Fetched users:", users);
  
        const head = users.find(
          (user) =>
            user.dept === department &&
            user.position === "Department Head"
        );
  
        // Log the found head of department
        console.log("Found department head:", head);
  
        if (head) {
          setHeadFullname(`${head.fName} ${head.lName}`);
          setHeadPosition(head.position);
        } else {
          console.log("No department head found for department:", department);
        }
      } catch (error) {
        console.error("Error fetching department head data:", error);
      }
    };
  
    if (department) {
      fetchHeadData();
    } else {
      console.log("Department not set");
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
                {fName} {lName}
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
                {pos}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdMonthComments;
