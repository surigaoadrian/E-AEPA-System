import React, { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, Tab, Tabs, TextField, Typography, Alert as MuiAlert } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TableRow from '@mui/material/TableRow';
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined';


const CustomAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Set the duration in milliseconds (e.g., 3000ms or 3 seconds)
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Set the Snackbar position to the center
    >
      <MuiAlert elevation={6} variant="filled" severity={severity} style={{ fontFamily: 'Poppins' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function ManageAccount() {

  const [openRegistration, setOpenRegistration] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [employStatus, setEmployStatus] = React.useState('');
  const [probeStatus, setProbeStatus] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [dateStarted, setDateStarted] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [role, setRole] = React.useState('');
  const [edit, setEdit] = React.useState(false);
  const [del, setDel] = React.useState(false);

  const [openDetails, setOpenDetails] = React.useState(false);
  const [rows, setRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: '' });
  const [errorAlert, setErrorAlert] = useState({ open: false, message: '' });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleUserInputChange = (event, fieldName) => {
    setSelectedUser({
      ...selectedUser,
      [fieldName]: event.target.value
    });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setEmailError(!/^[\w.%+-]+@cit\.edu$/i.test(value));
  };

  const [name, setName] = useState({
    fname: '',
    mname: '',
    lname: '',
  });

  const handleNameChange = (event, fieldName) => {
    const newValue = capitalizeFirstLetter(event.target.value);
    setName((prevName) => ({
      ...prevName,
      [fieldName]: newValue,
    }));
  };
  // Function to open success alert
  const showSuccessAlert = (message) => {
    setSuccessAlert({ open: true, message });
  };

  // Function to open error alert
  const showErrorAlert = (message) => {
    setErrorAlert({ open: true, message });
  };

  const columnsEmployees = [
    {
      id: 'workID',
      label: 'Work ID',
      align: 'center',
      minWidth: 150
    },

    {
      id: 'role',
      label: 'Employee Role',
      minWidth: 170,
      align: 'center',
      format: (value) => value ? value.toLocaleString('en-US') : '',
    },

    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      align: 'center',
      format: value => formatName(value),
    },

    {
      id: 'username',
      label: 'Username',
      minWidth: 150,
      align: 'center',
      format: (value) => value ? value.toLocaleString('en-US') : ''
    },

    {
      id: 'institutionalEmail',
      label: 'Email',
      minWidth: 150,
      align: 'center',
      format: (value) => value ? value.toLocaleString('en-US') : '',
    },

  ];

  const columnsAdmins = [
    {
      id: 'workID',
      label: 'Work ID',
      align: 'center',
      minWidth: 150
    },

    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      align: 'center',
      format: (value) => value ? `${value.firstname} ${value.lastname}` : '',
    },

    {
      id: 'username',
      label: 'Username',
      minWidth: 150,
      align: 'center',
      format: (value) => value ? value.toLocaleString('en-US') : ''
    },

    {
      id: 'institutionalEmail',
      label: 'Email',
      minWidth: 170,
      align: 'center'
    },


  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleClickAddUser = () => {
    setOpenRegistration(true);
  }

  const handleClickEdit = () => {
    setOpenEdit(true);
  }

  const handleSaveEditBtn = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/editUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updateUser = await response.json();
      showSuccessAlert('User updated successfully');
      fetchData();
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  const handleClickDelete = () => {
    setOpenDelete(true);
  }

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // Optionally, you can handle success or update UI accordingly
      showSuccessAlert('User deleted successfully');
      fetchData();
      setOpenDelete(false);
      setOpenDetails(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      // Optionally, you can show an error message to the user
    }
  };


  const handleSeeDetails = (userId) => {
    console.log('User ID:', userId);
    console.log('Rows:', rows);
    const selectedUser = rows.find(user => user.userID === userId);
    setSelectedUser(selectedUser);
    setOpenDetails(true);
  };

  const handleClickClose = () => {
    setOpenRegistration(false);
    setOpenDelete(false);
    setOpenEdit(false);
    setOpenDetails(false);

  }

  const handleCreateAccount = async () => {
    // const workID = generateWorkID();
    const firstName = capitalizeFirstLetter(document.getElementById('fname')?.value || '');
    const middleName = capitalizeFirstLetter(document.getElementById('mname')?.value || '');
    const lastName = capitalizeFirstLetter(document.getElementById('lname')?.value || '');
    try {

      const userData = {
        employStatus,
        probeStatus,
        dateStarted: document.getElementById('dateStarted')?.value || '',
        dateHired: document.getElementById('dateHired')?.value || '',
        username: document.getElementById('username')?.value || '',
        workID: document.getElementById('workId')?.value || '',
        firstname: firstName,
        middlename: middleName,
        lastname: lastName,
        institutionalEmail: document.getElementById('email')?.value || '',
        gender,
        password: document.getElementById('password')?.value || '',
        position: document.getElementById('position')?.value || '',
        department,
        role,
      };
      if (role === 'Admin') {
        userData.workID = document.getElementById('workId')?.value || '',
          userData.institutionalEmail = document.getElementById('email')?.value || '';
        userData.username = document.getElementById('username')?.value || '';
        userData.password = document.getElementById('password')?.value || '';
        userData.firstname = firstName,
          userData.middlename = middleName,
          userData.lastname = lastName
      }

      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        fetchData();
        showSuccessAlert('User registered successfully');
        setOpenRegistration(false);
      } else {
        showErrorAlert('Failed to register user. User already exists.');
      }
    } catch (error) {
      console.error('Network error', error);
    }

  };


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/users/getAllEmployeeAccounts');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // Filter data based on selected tab
      const filteredData = data.filter(item => {
        if (selectedTab === 0) { // All Employees
          return item.role !== 'Admin';
        } else if (selectedTab === 1) { // All Admins
          return item.role === 'Admin';
        }
      });
      // Process the data and set rows
      const processedData = filteredData.map(item => ({
        ...item,
        name: `${item.firstname} ${item.lastname}`,
        userID: item.userID
      }));
      setRows(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab]);





  const handleEmploymentStatus = (event) => {
    setEmployStatus(event.target.value);
    if (event.target.value !== 'probe') {
      setProbeStatus('');
      setDateStarted('');
    }
  };

  const handleProbeStatus = (event) => {
    setProbeStatus(event.target.value);

  }

  const handleDepartment = (event) => {
    setDepartment(event.target.value);

  };

  const handleGender = (event) => {
    setGender(event.target.value);
  }


  return <div>
    <Typography ml={5} mt={3} sx={{ fontFamily: 'Poppins', fontWeight: 'bold', fontSize: '25px' }} >User Accounts</Typography>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          ml: 5,
          mt: .5,
          width: '95%',
        },
      }}
    >

      <Grid container spacing={1.5}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} md={6} lg={4}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderRadius: '4px 4px 0 0',
            height: 15,
            mt: 3,
            width: '100%',


          }}>
          <Button
            variant="contained"
            sx={{
              height: 33,
              width: 120,
              mb: 4,
              fontFamily: 'Poppins',
              backgroundColor: '#8c383e',
              padding: '1px 1px 0 0 ',
              '&:hover': {
                backgroundColor: '#F8C702',
                color: 'black',
              },
            }}
            style={{
              textTransform: 'none',
            }}
            startIcon={<AddCircleIcon />}
            onClick={handleClickAddUser}
          >
            Add User
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ height: '7vh', display: 'flex', padding: '0px' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} textColor='primary' indicatorColor='primary' centered>
            <Tab label="All Employees"
              style={{
                fontFamily: 'Poppins',
                textTransform: 'none',
              }} />
            <Tab label="All Admins"
              style={{
                fontFamily: 'Poppins',
                textTransform: 'none',
              }} />
          </Tabs>
        </Grid>

        <Paper elevation={3} sx={{ borderRadius: '10px', width: '100%', height: '70vh' }}>

          <TableContainer sx={{ borderRadius: '10px 10px 0 0 ', maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead >
                <TableRow>
                  {(selectedTab === 0 ? columnsEmployees : columnsAdmins).map((column) => (
                    <TableCell
                      sx={{
                        fontFamily: 'Poppins',
                        bgcolor: '#8c383e',
                        color: 'white',
                        fontWeight: 'bold',
                        maxWidth: '5vh'
                      }}
                      key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    sx={{

                      '&:hover': {
                        backgroundColor: 'rgba(248, 199, 2, 0.5)',
                        color: 'black',
                      },
                    }}
                    key={row.id}>
                    {(selectedTab === 0 ? columnsEmployees : columnsAdmins).map((column) => (
                      <TableCell
                        sx={{ fontFamily: 'Poppins' }}
                        onClick={() => handleSeeDetails(row.userID)}
                        key={`${row.id}-${column.id}`} align={column.align}>
                        {column.id === 'name' ? row.name : column.format ? column.format(row[column.id]) : row[column.id]}
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


    {/* regis pop up screen */}
    <Dialog
      open={openRegistration}
      onClose={handleClickClose}

      sx={{
        '@media (min-width: 600px)': {
          width: '100vw',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#8c383e',
          height: '5vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Grid container spacing={.6}>
          <Grid item xs={12} sx={{ height: '4.5vh' }}  >
            <Grid
              container
              spacing={0.5}
              sx={{

                padding: '4px 0 6px 0',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'transparent',
                alignItems: 'center', // Align items vertically
              }}
            >
              <Grid item sx={{ height: '4.1vh' }}>
                <PersonRoundedIcon sx={{ color: 'white', fontSize: '28px', ml: 1 }} />
              </Grid>
              <Grid item sx={{ fontSize: '18px' }}>
                Register User Account
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <IconButton
          onClick={handleClickClose}
          sx={{

            '&:hover': {
              color: '#F8C702'
            },
          }}
        >
          <HighlightOffOutlinedIcon sx={{ fontSize: '28px', color: 'white' }} />
        </IconButton>
      </Box>
      <DialogContent>
        <Grid container spacing={.6}
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'left',
            width: '100%',
          }}>
          <Grid container spacing={.1} sx={{ width: '45vh' }}>
            <Grid item xs={3} sx={{ margin: 1 }}  >
              <Typography style={{ fontFamily: 'Poppins', color: 'gray' }}>User Role: </Typography>
            </Grid>
            <Grid item xs={7}>
              <FormControl sx={{ width: '30vh' }}>
                <Select
                  labelId="roleLabel"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  size="small"
                  sx={{ fontFamily: 'Poppins', }}
                >
                  <MenuItem style={{ fontFamily: 'Poppins', }} value='Admin'>Admin</MenuItem>
                  <MenuItem style={{ fontFamily: 'Poppins', }} value='Employee'>Employee</MenuItem>
                  <MenuItem style={{ fontFamily: 'Poppins', }} value='Department Head'>Department Head</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={.6}
          sx={{
            width: '100%',
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {role === 'Admin' && (
            <>


              {/* workid,fname,mname,lname,workemail,username, password, role, */}
              {Object.entries(name).map(([fieldName, value]) => (
                <Grid item xs={4} key={fieldName}>
                  <Box style={{ fontFamily: 'Poppins', }} height="100%">
                    <TextField
                      fullWidth
                      size="medium"
                      label={fieldName === 'fname' ? 'First Name' : fieldName === 'mname' ? 'Middle Name' : 'Last Name'}
                      id={fieldName}
                      value={value}
                      onChange={(event) => handleNameChange(event, fieldName)}
                      InputLabelProps={{
                        style: {
                          fontFamily: 'Poppins',
                        },
                      }}
                      inputProps={{
                        style: {
                          fontSize: '16px',
                          fontFamily: 'Poppins',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={6} >
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth size='medium'
                    label="Employee ID"
                    id="workId" /*value={generateWorkID()}*/
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }

                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Institutional Email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                    }}
                    error={emailError}
                    helperText={emailError ? 'Please enter a valid email' : ''}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={{ height: '100%' }}>
                  <TextField fullWidth size='medium' label="Admin Username" id="username"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ height: '100%' }}>
                  <TextField fullWidth size='medium' label="Admin Password" type="password" id="password"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
            </>
          )}
          {(role === 'Employee' || role === 'Department Head') && (
            <>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box >
                  <FormControl fullWidth size='medium'>
                    <InputLabel
                      id="employementStatusLabel"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Employment Status
                    </InputLabel>
                    <Select
                      labelId="employementStatusLabel"
                      id="employementStatus"
                      value={employStatus}
                      label="employment status"
                      onChange={handleEmploymentStatus}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem style={{ fontFamily: 'Poppins' }} value='Probationary'>Probationary</MenuItem>
                      <MenuItem style={{ fontFamily: 'Poppins' }} value='Regular'>Regular</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box sx={{ bgcolor: employStatus ? 'inherit' : 'transparent' }}>
                  <FormControl fullWidth size='medium' disabled={employStatus === 'Regular'}>
                    <InputLabel
                      id="probationaryStatus"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Probationary Status
                    </InputLabel>
                    <Select
                      labelId="probationaryStatusLabel"
                      id="probeStat"
                      value={probeStatus}
                      label="probationary status"
                      onChange={handleProbeStatus}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem style={{ fontFamily: 'Poppins' }} value={'3rd'}>3rd Probationary</MenuItem>
                      <MenuItem style={{ fontFamily: 'Poppins' }} value={'5th'}>5th Probationary</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box sx={{ bgcolor: employStatus == 'Regular' ? 'inherit' : 'transparent' }}>
                  <TextField fullWidth
                    disabled={employStatus === 'Regular'}
                    size='medium'
                    label="Date Started "
                    id="dateStarted"
                    type="date"

                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                      // Add a pattern to enforce the format MM/DD/YY
                      pattern: "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",

                    }}
                  />

                </Box>
              </Grid>
              <Grid item xs={8} sx={{ width: '100%', }}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Employee ID"
                    id="workId" /*value={generateWorkID()}*/
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box >
                  <TextField fullWidth
                    size='medium'
                    label="Date Hired "
                    id="dateHired"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                      // Add a pattern to enforce the format MM/DD/YY
                      pattern: "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",

                    }}
                  />
                </Box>
              </Grid>
              {Object.entries(name).map(([fieldName, value]) => (
                <Grid item xs={4} key={fieldName}>
                  <Box height="100%">
                    <TextField
                      fullWidth
                      size="medium"
                      label={fieldName === 'fname' ? 'First Name' : fieldName === 'mname' ? 'Middle Name' : 'Last Name'}
                      id={fieldName}
                      value={value}
                      onChange={(event) => handleNameChange(event, fieldName)}
                      InputLabelProps={{
                        style: {
                          fontFamily: 'Poppins',
                        },
                      }}
                      inputProps={{
                        style: {
                          fontSize: '16px',
                          fontFamily: 'Poppins',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={8} sx={{ width: '100%' }}>
                <Box sx={{ height: '100%' }}>
                  <TextField fullWidth size='medium' label="Institutional Email" id="email"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>

              </Grid>
              <Grid item xs={4}>
                <Box >
                  <FormControl fullWidth size='medium'>
                    <InputLabel
                      id="GenderLabel"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Gender
                    </InputLabel>
                    <Select
                      labelId="GenderLabel"
                      id="GenderLabel"
                      value={gender}
                      label="gender"
                      onChange={handleGender}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem style={{ fontFamily: 'Poppins' }} value={'female'}>Female</MenuItem>
                      <MenuItem style={{ fontFamily: 'Poppins' }} value={'male'}>Male</MenuItem>
                      <MenuItem style={{ fontFamily: 'Poppins' }} value={'other'}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box >
                  <TextField fullWidth size='medium' label="Username" id="username"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box >
                  <TextField fullWidth size='medium' label="Password" type="password" id="password"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ width: '100%' }}>
                <Box sx={{ height: '100%' }}>
                  <TextField fullWidth size='medium' label="Position" id="position"
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>

              </Grid>
              <Grid item xs={6}>
                <Box >
                  <FormControl fullWidth size='medium'>
                    <InputLabel
                      id="departmentLabel"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Department
                    </InputLabel>
                    <Select
                      labelId="departmentLabel"
                      id="department"
                      value={department}
                      label="department"
                      onChange={handleDepartment}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem style={{fontFamily:'Poppins'}} value={'ETO'}>Female</MenuItem>
                      <MenuItem style={{fontFamily:'Poppins'}} value={'m'}>Male</MenuItem>
                      <MenuItem style={{fontFamily:'Poppins'}} value={'o'}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}

        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'left',
          ml: '2vh',
        }}
      >
        <Button
          sx={{
            bgcolor: '#8c383e',
            color: 'white',
            width: '96.3%',
            '&:hover': {
              backgroundColor: '#F8C702',
              color: 'black',
            },
            display: role ? 'block ' : 'none',
          }}
          style={{
            textTransform: 'none',
            fontFamily: 'Poppins',
          }}

          onClick={handleCreateAccount}
        >
          Create Account
        </Button>
      </DialogActions>
    </Dialog>

    {/* pop up SEE DETAILS */}
    <Dialog
      open={openDetails}
      onAbort={handleClickClose}
      sx={{
        '@media (min-width: 600px)': {
          width: '100vw',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#8c383e',
          height: '5vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Grid container spacing={.6}>
          <Grid item xs={12} sx={{ height: '4.5vh' }}  >
            <Grid
              container
              spacing={0.5}
              sx={{

                padding: '4px 0 6px 0',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'transparent',
                alignItems: 'center', // Align items vertically
              }}
            >
              <Grid item sx={{ height: '4.1vh' }}>
                <ViewHeadlineOutlinedIcon sx={{ color: 'white', fontSize: '28px', ml: 1 }} />
              </Grid>
              <Grid item sx={{ fontSize: '18px' }}>
                User Details
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <IconButton
          onClick={handleClickClose}
          sx={{

            '&:hover': {
              color: '#F8C702'
            },
          }}
        >
          <HighlightOffOutlinedIcon sx={{ fontSize: '28px', color: 'white' }} />
        </IconButton>
      </Box>
      <DialogContent>
        <Grid container spacing={.6}
          sx={{
            width: '90%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {selectedUser?.role === 'Admin' && (
            <>
              <Grid item xs={12} >
                <Typography style={{fontFamily:'Poppins'}}>Name: {selectedUser?.firstname} {selectedUser.middlename} {selectedUser?.lastname}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}> Work ID :  {selectedUser?.workID}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Email: {selectedUser?.institutionalEmail}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Username: {selectedUser?.username} </Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Password: {selectedUser?.password}</Typography>

              </Grid>
            </>
          )}
          {(selectedUser?.role === 'Employee' || selectedUser?.role === 'Department Head') && (
            <>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>ID Number: <strong>{selectedUser?.workID}</strong></Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>User Role: {selectedUser?.role}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Name: {selectedUser?.firstname} {selectedUser.middlename} {selectedUser?.lastname}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography style={{fontFamily:'Poppins'}}>Email: {selectedUser?.institutionalEmail}</Typography>
              </Grid>

              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Department: {selectedUser?.department}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Position: {selectedUser?.position}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Employee Status: {selectedUser?.employStatus}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins'}}>Date Hired: {selectedUser?.dateHired}</Typography>
              </Grid>
              {selectedUser?.employStatus !== 'Regular' && (
                <>
                  <Grid item xs={6} >
                    <Typography style={{fontFamily:'Poppins'}}>Probationary Status: {selectedUser?.probeStatus}</Typography>
                  </Grid>
                  <Grid item xs={6} >
                    <Typography style={{fontFamily:'Poppins'}}>Date Started: {selectedUser?.dateStarted}</Typography>
                  </Grid>
                </>
              )}
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins', color:'rgba(248, 199, 2, 0.9)',  fontWeight:'lightbold'}}>Username: {selectedUser?.username}</Typography>
              </Grid>
              <Grid item xs={6} >
                <Typography style={{fontFamily:'Poppins', color:'rgba(248, 199, 2, 0.9)', fontWeight:'lightbold'}}>Password: {selectedUser?.password}</Typography>
              </Grid>
            </>
          )}

        </Grid>

      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={handleClickEdit}
          variant='contained'
          sx={{
            bgcolor: 'rgba(248, 199, 2, 0.9)',
            fontFamily: 'Poppins',
            color: 'black',
            '&:hover': {
              bgcolor: '#e0e0e0',
              color: 'black'
            },
          }}>
          Edit User
        </Button>
        <Button
          onClick={handleClickDelete}
          variant='contained'
          sx={{
            bgcolor: '#8c383e',
            fontFamily: 'Poppins',
            ml: '1vh',
            '&:hover': {
              bgcolor: '#e0e0e0',
              color: 'black',
            },
          }}>
          Delete User
        </Button>
      </DialogActions>
    </Dialog>


    {/* {POP up for edit} */}
    <Dialog
      open={openEdit}
      onAbort={handleClickClose}
      sx={{
        '@media (min-width: 600px)': {
          width: '100vw',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#8c383e',
          height: '5vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Grid container spacing={.6}>
          <Grid item xs={12} sx={{ height: '4.5vh' }}  >
            <Grid
              container
              spacing={0.5}
              sx={{

                padding: '4px 0 6px 0',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'transparent',
                alignItems: 'center', // Align items vertically
              }}
            >
              <Grid item sx={{ height: '4.1vh' }}>
                <EditNoteTwoToneIcon sx={{ color: 'white', fontSize: '28px', ml: 1 }} />
              </Grid>
              <Grid item sx={{ fontSize: '18px' }}>
                Edit User Details
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <IconButton
          onClick={handleClickClose}
          sx={{

            '&:hover': {
              color: '#F8C702'
            },
          }}
        >
          <HighlightOffOutlinedIcon sx={{ fontSize: '28px', color: 'white' }} />
        </IconButton>
      </Box>
      <DialogContent>
        <Grid container spacing={.6}
          sx={{
            display: 'flex',
            justifyContent: 'left',
            width: '100%',
            fontFamily: 'Poppins',
          }}>

          {selectedUser?.role === 'Admin' && (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth disabled>
                  <InputLabel
                    id="userRoleLabel"
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'Poppins',
                    }}
                  >
                    User Role
                  </InputLabel>
                  <Select
                    labelId="userRoleLabel"
                    id="role"
                    value={selectedUser?.role || ''}
                    label="user role"
                  >
                    <MenuItem value='Admin'>Admin</MenuItem>
                    <MenuItem value='Employee'>Employee</MenuItem>
                    <MenuItem value='Department Head'>Department Head</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Work ID"
                    id="workId"
                    value={selectedUser?.workID || ''}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }

                    }}
                  />
                </Box>
              </Grid>

              {/* workid,fname,mname,lname,workemail,username, password, role, */}
              {Object.entries(name).map(([fieldName, value]) => (
                <Grid item xs={4} key={fieldName}>
                  <Box height="100%">
                    <TextField
                      fullWidth
                      size="medium"
                      label={fieldName === 'fname' ? 'First Name' : fieldName === 'mname' ? 'Middle Name' : 'Last Name'}
                      id={fieldName}
                      value={fieldName === 'fname' ? selectedUser?.firstname || '' : fieldName === 'mname' ? selectedUser?.middlename || '' : selectedUser?.lastname || ''}
                      onChange={(event) => handleUserInputChange(event, fieldName)}
                      InputLabelProps={{
                        style: {
                          fontFamily: 'Poppins',
                        },
                      }}
                      inputProps={{
                        style: {
                          fontSize: '16px',
                          fontFamily: 'Poppins',  
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Institutional Email"
                    id="email"
                    value={selectedUser?.institutionalEmail || ''}
                    onChange={handleUserInputChange}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                    }}
                    error={emailError}
                    helperText={emailError ? 'Please enter a valid email' : ''}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} >
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Admin Username"
                    id="username"
                    value={selectedUser?.username || ''}
                    onChange={(e) => handleUserInputChange(e, 'username')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Admin Password"
                    type="password"
                    id="password"
                    value={selectedUser?.password || ''}
                    onChange={(e) => handleUserInputChange(e, 'password')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
            </>
          )}
          {(selectedUser?.role === 'Employee' || selectedUser?.role === 'Department Head') && (
            <>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box >
                  <FormControl
                    fullWidth
                    size='medium'
                    disabled={selectedUser?.employStatus === 'Regular'}>
                    <InputLabel
                      id="employementStatusLabel"

                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Employment Status
                    </InputLabel>
                    <Select
                      labelId="employementStatusLabel"
                      id="employementStatus"
                      value={selectedUser?.employStatus || ''}
                      label="employment status"
                      onChange={(e) => handleUserInputChange(e, 'employmentStatus')}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem style={{fontFamily:'Poppins'}} value='Probationary'>Probationary</MenuItem>
                      <MenuItem style={{fontFamily:'Poppins'}} value='Regular'>Regular</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box >
                  <FormControl
                    fullWidth
                    size='medium'
                    disabled={selectedUser?.employStatus === 'Regular'}>
                    <InputLabel
                      id="probationaryStatus"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',

                      }}
                    >
                      Probationary Status
                    </InputLabel>
                    <Select
                      labelId="probationaryStatusLabel"
                      id="probeStat"
                      value={selectedUser?.probeStatus || ''}
                      label="probationary status"
                      onChange={(e) => handleUserInputChange(e, 'probeStat')}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem 
                        style={{fontFamily:'Poppins'}}
                        value={3}
                      >
                        3rd Probationary
                      </MenuItem>
                      <MenuItem 
                        style={{fontFamily:'Poppins'}}
                        value={5}
                      >
                        5th Probationary
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box sx={{ bgcolor: employStatus == 'Regular' ? 'inherit' : 'transparent' }}>
                  <TextField
                    fullWidth
                    disabled
                    size='medium'
                    label="Date Started "
                    id="dateStarted"
                    type="date"
                    value={selectedUser?.dateStarted || ''}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                      // Add a pattern to enforce the format MM/DD/YY
                      pattern: "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",

                    }}
                  />

                </Box>
              </Grid>
              <Grid item xs={8} sx={{ width: '100%', }}>
                <Box sx={{ height: '100%' }}>
                  <TextField

                    fullWidth
                    size='medium'
                    label="Employee ID"
                    id="workId" /*value={generateWorkID()}*/
                    value={selectedUser?.workID || ''}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ width: '100%', }}>
                <Box >
                  <TextField fullWidth

                    size='medium'
                    label="Date Hired "
                    id="dateHired"
                    type="date"
                    value={selectedUser?.dateHired || ''}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      },
                      // Add a pattern to enforce the format MM/DD/YY
                      pattern: "(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{2}",

                    }}
                  />
                </Box>
              </Grid>
              {Object.entries(name).map(([fieldName, value]) => (
                <Grid item xs={4} key={fieldName}>
                  <Box height="100%">
                    <TextField
                      fullWidth
                      size="medium"
                      label={fieldName === 'fname' ? 'First Name' : fieldName === 'mname' ? 'Middle Name' : 'Last Name'}
                      id={fieldName}
                      value={fieldName === 'fname' ? selectedUser?.firstname || '' : fieldName === 'mname' ? selectedUser?.middlename || '' : selectedUser?.lastname || ''}
                      onChange={(event) => handleUserInputChange(event, fieldName)}
                      InputLabelProps={{
                        style: {
                          fontFamily: 'Poppins',
                        },
                      }}
                      inputProps={{
                        style: {
                          fontSize: '16px',
                          fontFamily: 'Poppins',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={8} sx={{ width: '100%' }}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    size='medium'
                    label="Institutional Email"
                    id="email"
                    value={selectedUser?.institutionalEmail || ''}
                    onChange={(e) => handleUserInputChange(e, 'email')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily : 'Poppins',
                      }
                    }} />
                </Box>

              </Grid>
              <Grid item xs={4}>
                <Box >
                  <FormControl
                    fullWidth
                    size='medium'
                    disabled>
                    <InputLabel

                      id="GenderLabel"
                      value={gender}
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Gender
                    </InputLabel>
                    <Select
                      labelId="GenderLabel"
                      id="GenderLabel"
                      value={selectedUser?.gender}
                      label="gender"
                      onChange={handleGender}
                    >
                      <MenuItem value={'female'}>Female</MenuItem>
                      <MenuItem value={'male'}>Male</MenuItem>
                      <MenuItem value={'other'}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box >
                  <TextField
                    fullWidth
                    size='medium'
                    label="Username"
                    id="username"
                    value={selectedUser?.username || ''}
                    onChange={(e) => handleUserInputChange(e, 'username')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box >
                  <TextField
                    fullWidth
                    size='medium'
                    label="Password"
                    type="password"
                    id="password"
                    value={selectedUser?.password || ''}
                    onChange={(e) => handleUserInputChange(e, 'password')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ width: '100%' }}>
                <Box sx={{ height: '100%' }}>
                  <TextField
                    fullWidth size='medium'
                    label="Position"
                    id="position"
                    value={selectedUser?.position || ''}
                    onChange={(e) => handleUserInputChange(e, 'position')}
                    InputLabelProps={{
                      style: {
                        fontFamily: 'Poppins',
                      },
                    }}
                    inputProps={{
                      style: {
                        fontSize: '15px',
                        fontFamily: 'Poppins',
                      }
                    }} />
                </Box>

              </Grid>
              <Grid item xs={6}>
                <Box >
                  <FormControl
                    fullWidth
                    size='medium'>
                    <InputLabel
                      id="departmentLabel"
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Department
                    </InputLabel>
                    <Select
                      labelId="departmentLabel"
                      id="department"
                      value={selectedUser?.department || ''}
                      label="department"
                      onChange={(e) => handleUserInputChange(e, 'department')}
                      sx={{ fontFamily: 'Poppins', }}
                    >
                      <MenuItem 
                        style={{fontFamily:'Poppins'}}
                        value={'ETO'}
                      >
                        Female
                      </MenuItem>
                      <MenuItem
                        style={{fontFamily:'Poppins'}}
                        value={'m'}
                      >
                        Male
                      </MenuItem>
                      <MenuItem 
                        style={{fontFamily:'Poppins'}}
                        value={'o'}
                      >
                        Other
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}


        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => handleSaveEditBtn(selectedUser?.userID)}
          variant='contained'
          sx={{
            bgcolor: 'rgba(248, 199, 2, 0.9)',
            fontFamily: 'Poppins',
            color: 'black',
            '&:hover': {
              bgcolor: '#e0e0e0',
              color: 'black'
            },

          }}>
          Save Changes

        </Button>
      </DialogActions>

    </Dialog>
    {/* pop up DELETE */}
    <Dialog
      open={openDelete}
      onClose={handleClickClose}
      sx={{
        '@media (min-width: 600px)': {
          width: '100vw',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#8c383e',
          height: '5vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Grid container spacing={.6}>
          <Grid item xs={12} sx={{ height: '4.5vh' }}  >
            <Grid
              container
              spacing={0.5}
              sx={{

                padding: '4px 0 6px 0',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: 'transparent',
                alignItems: 'center', // Align items vertically
              }}
            >
              <Grid item sx={{ height: '4.1vh' }}>
                <DeleteOutlineIcon sx={{ color: 'white', fontSize: '28px', ml: 1, height: '3.5vh' }} />
              </Grid>
              <Grid item sx={{ fontSize: '18px', height: '3.5vh' }}>
                Delete User Account
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <IconButton
          onClick={handleClickClose}
          sx={{

            '&:hover': {
              color: '#F8C702'
            },
          }}
        >
          <HighlightOffOutlinedIcon sx={{ fontSize: '28px', color: 'white' }} />
        </IconButton>
      </Box>
      <DialogContent>
        <DialogContentText sx={{ fontFamily: 'Poppins', color: 'black', display: 'flex', justifyContent: 'center', mt: '15px' }}>
          Are you sure you want to delete this user account?

        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => handleDelete(selectedUser?.userID)}
          variant='contained'
          sx={{
            fontFamily: 'Poppins',
            bgcolor: 'rgba(248, 199, 2, 0.9)',

            color: 'black',
            '&:hover': {
              bgcolor: '#e0e0e0',
              color: 'black'
            },

          }}>
          Yes
        </Button>
        <Button
          onClick={handleClickClose}
          variant='contained'
          sx={{
            fontFamily: 'Poppins',
            bgcolor: '#8c383e',
            ml: '1vh',
            '&:hover': {
              bgcolor: '#e0e0e0',
              color: 'black',
            },

          }}>
          No
        </Button>
      </DialogActions>

    </Dialog>
    <CustomAlert
      open={successAlert.open}
      onClose={() => setSuccessAlert({ ...successAlert, open: false })}
      severity="success"
      message={successAlert.message}
    />

    {/* Render error alert */}
    <CustomAlert
      open={errorAlert.open}
      onClose={() => setErrorAlert({ ...errorAlert, open: false })}
      severity="error"
      message={errorAlert.message}
    />



  </div >;
}

export default ManageAccount;
