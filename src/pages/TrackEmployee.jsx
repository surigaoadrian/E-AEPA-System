// NOTIFICATION KUWANG IF MADA
import React, { useState, useEffect, useMemo } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Skeleton, Card, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import Animated from "../components/motion";
import ViewResults from "../modals/ViewResults";
import PasswordConfirmationModal from "../modals/PasswordConfirmation";
import { apiUrl } from '../config/config';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckIcon from '@mui/icons-material/Check';
function TrackEmployee() {
  const userID = sessionStorage.getItem("userID");
  const [rows, setRows] = useState([]);
  const [updateFetch, setUpdateFetch] = useState(true);
  const [showViewRatingsModal, setViewRatingsModal] = useState(false);
  const [employee, setEmployee] = useState({});
  const [loggedUserData, setLoggedUserData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Adjust this based on your needs
  const pagesPerGroup = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [probeStatusFilter, setProbeStatusFilter] = useState('');
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

  const getProbationaryMonth = (probeStatus) => {
    const statusNumber = probeStatus.split(" ")[0];
    return parseInt(statusNumber); // Extract the number (e.g., 3 from "3rd probationary")
  };

  const calculateMonthsDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth() + 1;

    return yearsDiff * 12 + monthsDiff; // Total months difference
  };
  const fetchData = async () => {
    try {
      // Fetch user data
      const userResponse = await fetch(`${apiUrl}user/getUser/${userID}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setLoggedUserData(userData);

      // Fetch all users data
      const allUsersResponse = await fetch(`${apiUrl}user/getAllUser`);
      const allUsersData = await allUsersResponse.json();
      console.log(allUsersData);

      // Fetch evaluations data
      const evaluationsResponse = await fetch(`${apiUrl}evaluation/evaluations`);
      if (!evaluationsResponse.ok) {
        throw new Error("Failed to fetch evaluations data");
      }
      const evaluationsData = await evaluationsResponse.json();
      console.log("Evaluations Data:", evaluationsData);

      const currentDate = new Date(); // Ensure currentDate is defined

      // Create a map of evaluations by userID for easy lookup
      const evaluationsMap = evaluationsData.reduce((map, evaluation) => {
        map[evaluation.userId] = evaluation; // Assuming evaluations have a field called userID
        return map;
      }, {});

      const processedData = await Promise.all(
        allUsersData
          .filter((item) => item.role === "EMPLOYEE" && item.dept === userData.dept) // Filter employees with matching department
          .filter((item) => {
            if (probeStatusFilter === '') {
              return true;
            }
            if (probeStatusFilter === 'Annually' && item.probeStatus === '') {
              return true;
            }
            return item.probeStatus === probeStatusFilter;
          })
          .map(async (item) => {
            if (!item.dateHired) {
              console.warn("Invalid date hired:", item);
              return null;
            }

            const probationaryMonth = getProbationaryMonth(item.probeStatus);
            const monthsSinceHired = calculateMonthsDifference(item.dateHired, currentDate);
            const isRegularEmployee = item.empStatus === "Regular";

            const isEligibleForEvaluation =
              (isRegularEmployee && monthsSinceHired >= 6) ||
              (!isRegularEmployee && monthsSinceHired >= probationaryMonth);

            if (!isEligibleForEvaluation) return null;

            // Augment employee data with evaluation information if available
            const evaluation = evaluationsMap[item.userID]; // Match using userID
            return {
              ...item,
              name: `${item.fName} ${item.lName}`,
              userID: item.userID,
              probeStatus: item.probeStatus || "",
              probationaryMonth,
              monthsSinceHired,
              isEligibleForEvaluation,
              evaluation, // Include the evaluation data
            };
          })
      );

      const filteredData = processedData.filter((item) => item !== null);
      console.log("Filtered data:", filteredData);
      setRows(filteredData);

      // Apply search filter
      const searchFilteredData = filteredData.filter((item) =>
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
  }, [userID, updateFetch, searchTerm, probeStatusFilter]);

  useEffect(() => {
    if (!showPasswordModal) {
      fetchData();
    }
  }, [showPasswordModal, updateFetch, userID]);
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleMenuClick = (value) => {
    setProbeStatusFilter(value);
    handleCloseFilter();
  };
  const columnsEmployees = [
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
      format: (value) => formatName(value),
    },
    {
      id: "probeStatus",
      label: (
        <div >
          <span style={{ paddingLeft: 26 }}>Evaluation Period</span>
          <IconButton
            onClick={handleFilterClick}
            sx={{ color: 'white', width: '1.3em', height: '1.3em', ml: '.6vh' }}
          >
            <FilterAltIcon fontSize="medium" />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleCloseFilter}
            PaperProps={{
              sx: {
                '& .MuiMenuItem-root': {
                  fontSize: '.7em',
                  fontFamily: 'Poppins',
                },
              },
            }}
          >
            <MenuItem
              dense
              onClick={() => handleMenuClick('')}
              selected={probeStatusFilter === ''}
              sx={{ fontFamily: 'Poppins' }}
            >
              <ListItemIcon>{probeStatusFilter === '' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="All" style={{ fontFamily: 'Poppins', fontSize: '.5em', }} />
            </MenuItem>
            <MenuItem
              dense
              onClick={() => handleMenuClick('Annually')}
              selected={probeStatusFilter === 'Annually'}
              sx={{ fontFamily: 'Poppins', fontSize: '.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === 'Annually' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="Annually" sx={{ fontFamily: 'Poppins', fontSize: '.5em' }} />
            </MenuItem>
            <MenuItem
              dense
              onClick={() => handleMenuClick('3rd Probationary')}
              selected={probeStatusFilter === '3rd Probationary'}
              sx={{ fontFamily: 'Poppins', fontSize: '.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === '3rd Probationary' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="3rd Probationary" sx={{ fontFamily: 'Poppins', fontSize: '.5em' }} />
            </MenuItem>
            <MenuItem
              dense
              onClick={() => handleMenuClick('5th Probationary')}
              selected={probeStatusFilter === '5th Probationary'}
              style={{ fontFamily: 'Poppins', fontSize: '.5em' }}
            >
              <ListItemIcon>{probeStatusFilter === '5th Probationary' && <CheckIcon fontSize="small" />}</ListItemIcon>
              <ListItemText primary="5th Probationary" sx={{ fontFamily: 'Poppins', fontSize: '.5em' }} />
            </MenuItem>
          </Menu>

        </div>
      ),
      minWidth: 150,
      align: "center",
      format: (value) => {
        if (value === "") {
          return "Annually";
        } else {
          return value;
        }
      },
    },
    {
      id: "sjbpStatus",
      label: "S-JBPA Status",
      minWidth: 150,
      align: "center",
      format: (value) => {
        if (value === "OPEN") {
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>//SA WA PA NAOPEN ANG EVAL, PENDING RA AKO GBUTANG
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
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>//SA WA PA NAOPEN ANG EVAL, PENDING RA AKO GBUTANG
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
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>;
        } else if (value === "COMPLETED") {
          return <span style={{ color: 'green', fontWeight: "bold" }}>COMPLETED</span>;
        } else {
          return <span style={{ color: 'red', fontWeight: 'bold' }}>PENDING</span>//SA WA PA NAOPEN ANG EVAL, PENDING RA AKO GBUTANG
        }
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
            Track Employees Evaluation
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


        <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { ml: 6, mt: 4, width: "93.5%" } }}>
          <Grid container
            spacing={1.5}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            {/* <Card variant="outlined" sx={{ borderRadius: "5px", width: "100%", height: "27.1em", backgroundColor: "transparent"}}> */}
            {showPasswordModal ? (
              <Skeleton variant="rectangular" width="100%" height="100%"></Skeleton>
            ) : (
              <TableContainer sx={{ height: '100%', borderRadius: "5px 5px 0 0 ", border: '1px solid lightgray', width:'100%' }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead sx={{ height: "2em" }}>
                    <TableRow>
                      {columnsEmployees.map((column) => (
                        <TableCell
                          sx={{ fontFamily: "Poppins", bgcolor: "#8c383e", color: "white", fontWeight: "bold", maxWidth: "2em" }}
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
                            bgcolor: 'white',
                            "&:hover": { backgroundColor: "rgba(248, 199, 2, 0.5)", color: "black" },
                            height: '3em'
                          }}
                          key={row.userID} // Use a unique identifier for the key
                        >
                          {columnsEmployees.map((column) => (
                            <TableCell sx={{ fontFamily: "Poppins" }} key={`${row.userID}-${column.id}`} align={column.align}>
                              {column.id === "name" ? (
                                row.name
                              ) :  column.id === "probeStatus" ? (
                                column.format(row.probeStatus) // Accessing the probeStatus correctly
                            ) : (
                                column.format ? column.format(row.evaluation?.[column.id]) : row.evaluation?.[column.id] || 'N/A' // Handle undefined evaluations
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ height: '30.87em', borderRadius: '5px 5px 0 0' }} colSpan={columnsEmployees.length} align="center">
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
              position: "relative", // Change to relative to keep it in place
              // bottom: 200,
              // left: '20%',
              // transform: "translateX(-50%)",
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
