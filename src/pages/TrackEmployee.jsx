import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, Menu, } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";
import ViewResults from "../modals/ViewResults";
import Fade from '@mui/material/Fade';

function TrackEmployee() {
  const userID = sessionStorage.getItem("userID");
  const [user, setUser] = useState({});
  const [rows, setRows] = useState([]);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [showViewRatingsModal, setViewRatingsModal] = useState(false);
  const [employee, setEmployee] = useState({});

  //fetch the user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch specific user data based on userID
        const userResponse = await fetch(`http://localhost:8080/user/getUser/${userID}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);
        console.log("User data:", userData);

        // Fetch all users
        const allUsersResponse = await fetch("http://localhost:8080/evaluation/evaluations");
        if (!allUsersResponse.ok) {
          throw new Error("Failed to fetch all users data");
        }
        const allUsersData = await allUsersResponse.json();
        console.log("All users data:", allUsersData);
        const processedData = allUsersData
          .filter((item) => item.role === "EMPLOYEE" && item.dept === userData.dept)
          .map((item) => ({
            ...item,
            name: `${item.fName} ${item.lName}`,
            userID: item.userID,
          }));

          console.log("Processed data:", processedData);
        setRows(processedData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userID, updateFetch]);

  const handleViewResultClick = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/getUser/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setViewRatingsModal(true);
      setEmployee(userData);
      console.log("Selected employee:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };




  const columnsEmployees = [
    {
      id: "workID",
      label: "ID No.",
      align: "center",
      minWidth: 100,
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
      id: "empStatus",
      label: "Employee Status",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? value.toLocaleString("en-US") : ""),
    },
    {
      id: "sjbpStatus",
      label: "S-JBPA Status",
      minWidth: 150,
      align: "center",
      format: (value) => {    
        if (value === "OPEN") {
          return <span style={{color:'red', fontWeight:'bold'}}>OPEN</span> ;
        } else if(value === "COMPLETED") {
          return <span style={{color:'green', fontWeight:"bold"}}>COMPLETED</span> ;
        }else{
          return "Not Yet Open"
        }
      },
    },
    
    {
      id: "svbpaStatus",
      label: "S-VBPA Status",
      minWidth: 150,
      align: "center",
      format: (value) => {    
        if (value === "OPEN") {
          return <span style={{color:'red', fontWeight:'bold'}}>OPEN</span> ;
        } else if(value === "COMPLETED") {
          return <span style={{color:'green', fontWeight:"bold"}}>COMPLETED</span> ;
        }else{
          return "Not Yet Open"
        }
      },
    },
    {
      id: "pvbpaStatus",
      label: "P-VBPA Status",
      minWidth: 150,
      align: "center",
      format: (value) => {    
        if (value === "OPEN") {
          return <span style={{color:'red', fontWeight:'bold'}}>OPEN</span> ;
        } else if(value === "COMPLETED") {
          return <span style={{color:'green', fontWeight:"bold"}}>COMPLETED</span> ;
        }else{
          return "Not Yet Open"
        }
      },
    },

    {
      id: "actions",
      label: "Result",
      minWidth: 150,
      align: "center",
      format: (value, row) => {
        return (
          <div>
            {row.empStatus === "Probationary" && row.sjbpStatus === "COMPLETED" && row.svbpaStatus === "COMPLETED" && row.pvbpaStatus === "COMPLETED"  (
              <Button sx={{
                color: '#8c383e',
                fontSize: '.9em', "&:hover": { color: "red", },
              }}
                style={{ textTransform: "none", }} startIcon={<FontAwesomeIcon icon={faEye} style={{ fontSize: ".8rem", }} />}
                onClick={() => handleViewResultClick(row.userId)}>
                View
              </Button>
            )}

          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Animated>
        <Typography ml={6.5} mt={3} sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}>Track Employees </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { ml: 6, mt: 4, width: "93.5%" }, }}>
          <Grid container spacing={1.5} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", }}>
            <Paper elevation={1} sx={{ borderRadius: "5px", width: "100%", height: "32em", backgroundColor: "transparent", mt: '.2%' }}>
              <TableContainer sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%", }} >
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead sx={{ height: "2em" }}>
                    <TableRow>
                      {columnsEmployees.map((column) => (
                        <TableCell sx={{
                          fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: "bold", maxWidth: "2em",
                        }} key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow sx={{ bgcolor: 'white', "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", color: "black", }, height:'3em' }} key={row.id}>
                        {columnsEmployees.map((column) => (
                          <TableCell sx={{ fontFamily: "Poppins", }} key={`${row.id}-${column.id}`} align={column.align}>
                            {column.id === "name" ? row.name : column.id === "actions" ? column.format ? column.format(row[column.id], row) : null : column.format ? column.format(row[column.id]) : row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <ViewResults
            open={showViewRatingsModal}
            onClose={() => setViewRatingsModal(false)}
            employee={employee}
          />
        </Box>
      </Animated>
    </div>
  );
}

export default TrackEmployee;



