import React, { useState, useEffect, useMemo } from "react";
import Animated from "../components/motion";
import { Box, Grid, Typography, Card, Button, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPen, faUserMinus, faBuildingCircleCheck, faBuildingCircleXmark, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { format, parseISO } from 'date-fns';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { apiUrl } from '../config/config';

function ActivityLogs() {
  const id = sessionStorage.getItem("userID");
  const role = sessionStorage.getItem("userRole");
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjust this based on your needs
  const pagesPerGroup = 5;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const startPageGroup = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPageGroup = Math.min(startPageGroup + pagesPerGroup - 1, totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };



  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const hasData = rows.length > 0 ;

  const fetchActivityLogs = async () => {
    try {
      let response;
      if (role === "SUPERUSER") {
        response = await fetch(`${apiUrl}activityLog/ActivityLog`);
      } else {
        response = await fetch(`${apiUrl}activityLog/ActivityLogByAdmin/${id}`);
      }

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const logs = await response.json();
       // Sort logs by timestamp from latest to earliest
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRows(logs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig.key) {
      sortableRows.sort((a, b) => {
        if (sortConfig.key === 'timestamp') {
          return sortConfig.direction === 'asc'
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        } else {
          return sortConfig.direction === 'asc'
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
      });
    }
    return sortableRows;
  }, [rows, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedRows.slice(startIndex, endIndex);
  }, [currentPage, sortedRows]);

  const columnsHeader = [
    {
      id: "activity",
      label: (
        <div style={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
          Activity
          <IconButton onClick={()=> requestSort('activity')} sx={{color:'white', width:"1.3em",height:'1.3em', ml:'.6vh',}}><SwapVertRoundedIcon fontSize="medium"  /></IconButton>
        </div>
      ),
      align: "left",
      minWidth: 100,
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
      minWidth: 90,
      align: "center",
      format: (value) => (value ? format(parseISO(value), 'yyyy-MM-dd , hh:mm a').replace(/am|pm/, match => match.toUpperCase()) : ""),
    },
  ];

  if (role === "SUPERUSER") {
    // Find the index of the "activity" column
    const activityIndex = columnsHeader.findIndex(col => col.id === "activity");

    // Insert the "Admin" column right after "Activity"
    columnsHeader.splice(activityIndex + 1, 0, {
      id: "admin",
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Admin
          <IconButton onClick={()=> requestSort('admin')} sx={{color:'white', width:"1.3em",height:'1.3em', ml:'.6vh'}}><SwapVertRoundedIcon fontSize="medium"  /></IconButton>
        </div>
      ),
      minWidth: 200,
      align: "center",
    });
  }

  const getActivityIcon = (activity) => {
    switch (activity) {
      case "Created User Account":
        return <FontAwesomeIcon icon={faUser} style={{ color: "green", paddingRight: 5 }} />;
      case "Edited User Account":
        return <FontAwesomeIcon icon={faUserPen} style={{ color: "#1520A6", paddingRight: 5 }} />;
      case "Deleted User Account":
        return <FontAwesomeIcon icon={faUserMinus} style={{ color: "#8C383E", paddingRight: 5 }} />;
      case "Created Department":
        return <FontAwesomeIcon icon={faBuilding} style={{ color: "green", paddingRight: 5 }} />;
      case "Edited Department":
        return <FontAwesomeIcon icon={faBuildingCircleCheck} style={{ color: "#1520A6", paddingRight: 5 }} />;
      case "Deleted Department":
        return <FontAwesomeIcon icon={faBuildingCircleXmark} style={{ color: "#8C383E", paddingRight: 5 }} />;
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
              <TableContainer  sx={{ borderRadius: "5px 5px 0 0 ", maxHeight: "100%",position:'relative', border:'1px solid lightgray'}}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead sx={{ height: "3em" }}>
                    <TableRow>
                      {columnsHeader.map((column) => (
                        <TableCell
                          sx={{ fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: 500, width: "10%", paddingLeft: column.id === "activity" ? "15vh" : 0 }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {hasData ? (
                    <TableBody>
                      {paginatedRows.map((row) => (
                        <TableRow
                          sx={{
                            bgcolor: "white",
                            "&:hover": { backgroundColor: "#FFECA1", color: "black" },
                          }}
                          key={row.activityID}
                        >
                          {columnsHeader.map((column) => (
                            <TableCell
                            component="th" scope="row"
                              sx={{
                                fontFamily: "Poppins",
                                 fontWeight: 500,
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
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ bgcolor: 'white', height: '5em', }} colSpan={columnsHeader.length} align="center">
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "17px",
                              color: "#1e1e1e",
                              fontWeight: 500,
                              padding: "25px",
                            }}
                          >
                            The activity log is currently empty.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
          </Grid>
        </Box>
        { /* Pagination */}
        <div
          className="rounded-b-lg mt-2 border-gray-200 px-4 py-2 ml-9"
          style={{
            position: "absolute", // Change to relative to keep it in place
            bottom: 100,
            left: '24%',
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            ml: '4em'
          }}
        >
          <ol className="flex justify-end gap-1 text-xs font-medium">
            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handlePrevPage}
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>

            {Array.from({ length: endPageGroup - startPageGroup + 1 }, (_, index) => (
              <li key={startPageGroup + index}>
                <a
                  href="#"
                  className={`block h-8 w-8 rounded border ${currentPage === startPageGroup + index
                      ? "border-pink-900 bg-pink-900 text-white"
                      : "border-gray-100 bg-white text-gray-900"
                    } text-center leading-8`}
                  onClick={() => handlePageChange(startPageGroup + index)}
                >
                  {startPageGroup + index}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                onClick={handleNextPage}
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ol>
        </div>
      </Animated>
    </div>
  );
}

export default ActivityLogs;
