import React, { useState, useEffect } from "react";
import Animated from "../components/motion";
import { Box, Grid, Typography, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPen, faUserMinus,faBuildingCircleCheck ,faBuildingCircleXmark,faBuilding} from "@fortawesome/free-solid-svg-icons";
import { format, parseISO } from 'date-fns';

function ActivityLog() {
  const id = sessionStorage.getItem("userID");
  console.log("ID: ", id);
  const role = sessionStorage.getItem("userRole");
  console.log("Role: ", role);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      let response ;
      if (role === "SUPERUSER") {
        response = await fetch(`http://localhost:8080/activityLog/ActivityLog`);
      } else{
        response = await fetch(`http://localhost:8080/activityLog/ActivityLogByAdmin/${id}`);
      }

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const logs = await response.json();
      setRows(logs);
    } catch (error) {
      console.log(error);
    }
  };

  const columnsHeader = [
    {
      id: "activity",
      label: "Activity",
      align: "left",
      minWidth: 150,
    },
    {
      id: "actDetails",
      label: "Details",
      minWidth: 300,
      align: "center",
    },
    {
      id: "timestamp",
      label: "Timestamp",
      minWidth: 150,
      align: "center",
      format: (value) => (value ? format(parseISO(value), 'yyyy-MM-dd , hh:mm a').replace(/am|pm/, match => match.toUpperCase()) : ""),
    },
  ];

  const getActivityIcon = (activity) => {
    switch (activity) {
      case "Created User Account":
        return <FontAwesomeIcon icon={faUser} style={{ color: "green",paddingRight:5}}/>;
      case "Edited User Account":
        return <FontAwesomeIcon icon={faUserPen}  style={{color: "#1520A6",paddingRight:5}}/>;
      case "Deleted User Account":
        return <FontAwesomeIcon icon={faUserMinus}  style={{color: "#8C383E",paddingRight:5}}/>;
      case "Created Department":
        return <FontAwesomeIcon icon={faBuilding} style={{ color: "green",paddingRight:5}}/>;
      case "Edited Department":
        return <FontAwesomeIcon icon={faBuildingCircleCheck}  style={{color: "#1520A6",paddingRight:5}}/>;
      case "Deleted Department":
        return <FontAwesomeIcon icon={faBuildingCircleXmark}  style={{color: "#8C383E",paddingRight:5}}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Animated>
        <Typography ml={6.5} mt={3} sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}>
          Activity Logs
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": { ml: 6, mt: 4, width: "93.5%" },
          }}
        >
          <Grid container spacing={1.5} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Paper elevation={1} sx={{ borderRadius: "5px", width: "100%", height: "32em", backgroundColor: "transparent", mt: ".2%" }}>
              <TableContainer sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead sx={{ height: "2em" }}>
                    <TableRow>
                      {columnsHeader.map((column) => (
                        <TableCell
                          sx={{ fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: 500, width: "10%" ,paddingLeft:column.id === "activity" ? "15vh" : 0}}
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
                          "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", color: "black" },
                        }}
                        key={row.activityID}
                      >
                        {columnsHeader.map((column) => (
                          <TableCell
                            sx={{
                              fontFamily: "Poppins",
                              // fontWeight: 500,
                              textAlign: column.id !== "timestamp" ? "left" : "center", // Align left for 'activity' and 'actDetails', center for 'timestamp'
                              paddingLeft: column.id !== "timestamp" ? "7vh" : 0, // Add padding for 'activity' column
                            }}
                            key={`${row.activityID}-${column.id}`}
                            align={column.align}
                          >
                            {column.id === "activity" ? (
                              <span>
                                {getActivityIcon(row[column.id])} {row[column.id]}
                              </span>
                            ) : (
                              column.format ? column.format(row[column.id]) : row[column.id]
                            )}
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
      </Animated>
    </div>
  );
}

export default ActivityLog;