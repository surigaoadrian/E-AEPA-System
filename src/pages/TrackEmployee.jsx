import React, { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Skeleton, Card, TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";
import ViewResults from "../modals/ViewResults";
import ViewRatingsPage from "./ViewRatingsPage"; 
import Fade from '@mui/material/Fade';
import PasswordConfirmationModal from "../modals/PasswordConfirmation";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

function TrackEmployee() {
  const userID = sessionStorage.getItem("userID");
  const [rows, setRows] = useState([]);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [showViewRatingsModal, setViewRatingsModal] = useState(false);
  const [employee, setEmployee] = useState({});
  const [loggedUserData, setLoggedUserData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjust this based on your needs
  const pagesPerGroup = 5;
  const [searchTerm, setSearchTerm] = useState('');


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

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [currentPage, rows]);

  const hasData = rows.length > 0;


  const fetchData = async () => {
    try {
      const userResponse = await fetch(`http://localhost:8080/user/getUser/${userID}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setLoggedUserData(userData);

      const allUsersResponse = await fetch("http://localhost:8080/evaluation/evaluations");
      if (!allUsersResponse.ok) {
        throw new Error("Failed to fetch all users data");
      }
      const allUsersData = await allUsersResponse.json();
      const processedData = allUsersData
        .filter((item) => item.role === "EMPLOYEE" && item.dept === userData.dept)
        .map((item) => ({
          ...item,
          name: `${item.fName} ${item.lName}`,
          userID: item.userID,
        }));
      // Apply search filter
      const searchFilteredData = processedData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setRows(searchFilteredData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userID, updateFetch, searchTerm]);

  useEffect(() => {
    if (!showPasswordModal) {
      fetchData();
    }
  }, [showPasswordModal, updateFetch, userID]);

  const handleViewResultClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/getUser/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setViewRatingsModal(true);
      setEmployee(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columnsEmployees = [
    {
      id: "workID",
      label: "ID No.",
      align: "center",
      minWidth: 90,
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
      minWidth: 100,
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
          return <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
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
          return <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
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
          return <span style={{ color: 'red', fontWeight: 'bold' }}>OPEN</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
          return "Not Yet Open"
        }
      },
    },

    {
      id: "actions",
      label: "Result",
      minWidth: 100,
      align: "center",
      format: (value, row) => {
        return (
          <div>
            {row.empStatus === "Probationary" && row.sjbpStatus === "COMPLETED" && row.svbpaStatus === "COMPLETED" && row.pvbpaStatus === "COMPLETED" && (
              <Button sx={{
                color: '#8c383e',
                fontSize: '.9em', "&:hover": { color: "red", },
                fontFamily: 'Poppins'
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <PasswordConfirmationModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={() => setShowPasswordModal(false)}
        loggedUserData={loggedUserData}
      />
      <Animated>
        {showPasswordModal ? (
          <Skeleton variant="text" sx={{ fontSize: '3em', width: '8em', ml: '1em', mt: '.3em' }}></Skeleton>
        ) : (
          <Typography ml={6.5} mt={3} sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "1.5em" }}>
            Track Employees
          </Typography>
        )}
        {showPasswordModal ? (
          <Skeleton variant="text" sx={{ fontSize: '3em', width: '6em', ml: '1em', }}></Skeleton>
        ) : (
          <div className="ml-8 mt-2">
            <div className="mr-10  flex items-center justify-between">
              <div className="ml-4 flex items-center justify-start">
                <TextField
                  placeholder="Search ..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{

                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff", // Set the background color for the entire input area
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "1px",
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#e0e0e0",
                    },
                    "&:focus-within": {
                      "& fieldset": {
                        borderColor: "#8C383E !important",
                        borderWidth: "1px !important",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "10px 10px",
                      fontSize: "13px",
                      fontFamily: "Poppins",
                    },
                    minWidth: "110%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ fontSize: "13px", padding: "0" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}


        <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { ml: 6, mt: 1, width: "93%" } }}>
          <Grid container spacing={1.5} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            {/* <Card variant="outlined" sx={{ borderRadius: "5px", width: "100%", height: "27.1em", backgroundColor: "transparent",position:'relative'}}> */}
              {showPasswordModal ? (
                <Skeleton variant="rectangular" width="100%" height="27.1em" sx={{bgcolor:'lightgray'}}></Skeleton>
              ) : (
                <TableContainer sx={{ borderRadius: "5px 5px 0 0", maxHeight: "100%",border:'1px solid lightgray' }}>
                  <Table stickyHeader aria-label="a dense table" size="small">
                    <TableHead sx={{ height: "2em" }}>
                      <TableRow>
                        {columnsEmployees.map((column) => (
                          <TableCell
                           component="th" scope="row"
                            sx={{ fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: "bold", fontSize: ".8em" }}
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
                            sx={{ bgcolor: 'white', "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", color: "black" } }}
                            key={row.id}
                          >
                            {columnsEmployees.map((column) => (
                              <TableCell  component="th" scope="row" sx={{ fontFamily: "Poppins" ,fontSize:'.8em'}} key={`${row.id}-${column.id}`} align={column.align}>
                                {column.id === "name" ? row.name : column.id === "actions" ? column.format ? column.format(row[column.id], row) : null : column.format ? column.format(row[column.id]) : row[column.id]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ bgcolor: 'white', height: '28.25em', borderRadius: '0 0 5px 5px' }} colSpan={columnsEmployees.length} align="center">
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
                              There are currently no data in this table</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                  </Table>
                </TableContainer>
              )}
            {/* </Card> */}
          </Grid>
          <ViewResults
            open={showViewRatingsModal}
            onClose={() => setViewRatingsModal(false)}
            employee={employee}
          />
        </Box>
        {/* pagination */}
        {showPasswordModal ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          < div
            className="rounded-b-lg mt-2 border-gray-200 px-4 py-2 ml-9"
            style={{
              position: "absolute", // Change to relative to keep it in place
              bottom: 170,
              left: '21%',
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
        )}

      </Animated >
    </div >
  );
}

export default TrackEmployee;
