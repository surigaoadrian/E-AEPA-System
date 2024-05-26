import React, { useState, useEffect, useRef } from 'react';
import { Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress, TableFooter, TablePagination, IconButton, Snackbar, Menu, MenuItem, ClickAwayListener } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ViewResults from "../modals/ViewResults";
import axios from 'axios';

function TrackEmployee() {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [evaluationStatusFilter, setEvaluationStatusFilter] = useState('');
  const [finalResultFilter, setFinalResultFilter] = useState('');
  const [viewResultFilter, setViewResultFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState('');
  const [showViewRatingsModal, setViewRatingsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData = [
          { id: 1, name: 'John Doe', position: 'Software Engineer', evaluationPeriod: 'Q1 2024', evaluationStatus: 'Not Yet Evaluated', finalResult: 'In Progress', viewresult: '-' },
          { id: 2, name: 'Jane Smith', position: 'UI/UX Designer', evaluationPeriod: 'Q1 2024', evaluationStatus: 'Completed', finalResult: 'Completed', viewresult: 'View' },
          // Add more sample data as needed
        ];
        setEmployeeData(mockData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setEmployeeData([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (employee) => {
    setSelectedRow(employee.id);
  };

  const clearSelectedRow = (event) => {
    if (!tableRef.current.contains(event.target)) {
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', clearSelectedRow);

    return () => {
      document.body.removeEventListener('click', clearSelectedRow);
    };
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications((prev) => {
      const newNotifications = { ...prev, [id]: !prev[id] };
      const message = newNotifications[id] ? 'You have successfully sent a reminder to this person!' : 'Notification removed';
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      return newNotifications;
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleViewResultClick = (employee) => {
    console.log("Selected Employee:", employee);
    setSnackbarMessage(`Redirecting to view result for ${employee.name}`);
    setSnackbarOpen(true);
    setSelectedEmployee(employee);
    setViewRatingsModal(true);
  };

  const handleFilterClick = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setFilterColumn('');
  };

  const handleFilterSelect = (filterValue) => {
    if (filterColumn === 'evaluationStatus') {
      setEvaluationStatusFilter(filterValue);
    } else if (filterColumn === 'finalResult') {
      setFinalResultFilter(filterValue);
    } else if (filterColumn === 'viewResult') {
      setViewResultFilter(filterValue);
    }
    handleFilterClose();
  };

  const tableRef = useRef(null);

  const filteredData = employeeData.filter((employee) => {
    return (
      (evaluationStatusFilter === '' || employee.evaluationStatus.includes(evaluationStatusFilter)) &&
      (finalResultFilter === '' || employee.finalResult.includes(finalResultFilter)) &&
      (viewResultFilter === '' || employee.viewresult.includes(viewResultFilter))
    );
  });

  return (
    <>
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            paddingTop: '2rem',
            paddingLeft: '2rem'
          }}
        >
          Track Employee
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ border: 'none', padding: '1rem', margin: '.1rem' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Table ref={tableRef} sx={{ backgroundColor: 'white' }}>
              <TableHead sx={{ backgroundColor: 'maroon' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>Employee ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>Position</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>Evaluation Period</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>
                    Evaluation Status
                    <IconButton onClick={(e) => handleFilterClick(e, 'evaluationStatus')} sx={{ color: 'white' }}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid white' }}>
                    Final Result
                    <IconButton onClick={(e) => handleFilterClick(e, 'finalResult')} sx={{ color: 'white' }}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    View Result
                    <IconButton onClick={(e) => handleFilterClick(e, 'viewResult')} sx={{ color: 'white' }}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <TableRow 
                      key={employee.id}
                      onClick={() => handleRowClick(employee)}
                      sx={{ backgroundColor: selectedRow === employee.id ? 'lightyellow' : 'inherit', cursor: 'pointer' }}
                    >
                      <TableCell sx={{ textAlign: 'center' }}>{employee.id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{employee.name}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{employee.position}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{employee.evaluationPeriod}</TableCell>
                      <TableCell sx={{ 
                        textAlign: 'center', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        color: employee.evaluationStatus === 'Not Yet Evaluated' ? 'red' : 'inherit' 
                      }}>
                        {employee.evaluationStatus}
                        {employee.evaluationStatus === 'Not Yet Evaluated' && (
                          <IconButton onClick={() => handleNotificationClick(employee.id)} sx={{ ml: 1 }}>
                            {notifications[employee.id] ? <NotificationsActiveIcon sx={{ color: 'yellow' }} /> : <NotificationsIcon />}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{employee.finalResult}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {employee.viewresult === 'View' ? (
                      <div className="flex items-center justify-center">
                      <button 
                      className="flex items-center text-white px-3 py-2 rounded" 
                      style={{ backgroundColor: '#8C383E', border: 'none' }} 
                      onClick={() => handleViewResultClick(employee)}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="mr-2"
                        style={{ cursor: 'pointer', color: 'white', fontSize: '1.3rem' }}
                        
                      />
                      <span className="text-sm">View </span>
                    </button>
                      </div>
                        ) : (
                          employee.viewresult
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={7}
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </Box>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterSelect('')}>All</MenuItem>
        {filterColumn === 'evaluationStatus' && (
          <>
            <MenuItem onClick={() => handleFilterSelect('Not Yet Evaluated')}>Not Yet Evaluated</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('Completed')}>Completed</MenuItem>
          </>
        )}
        {filterColumn === 'finalResult' && (
          <>
            <MenuItem onClick={() => handleFilterSelect('In Progress')}>In Progress</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('Completed')}>Completed</MenuItem>
          </>
        )}
        {filterColumn === 'viewResult' && (
          <>
            <MenuItem onClick={() => handleFilterSelect('View')}>View</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('-')}>-</MenuItem>

            
          </>
        )}
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Grid>

        <ViewResults
        open={showViewRatingsModal}
        onClose={() => setViewRatingsModal(false)}
        employee={selectedEmployee}
        />
        </>

  );
}

export default TrackEmployee;
