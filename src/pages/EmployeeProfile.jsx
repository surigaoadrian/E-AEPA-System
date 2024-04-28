import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import VerifiedIcon from '@mui/icons-material/Verified';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#800000', // Maroon color
    },
  },
});

const tabs = [
  { label: '3rd Month', value: '1', sx: { textTransform: 'capitalize' } },
  { label: '5th Month', value: '2', sx: { textTransform: 'capitalize' } },
  { label: 'Annual', value: '3', sx: { textTransform: 'capitalize' } },
];

const yearEvaluations = [
  { value: '', label: 'Select Year Evaluation' },
  { value: '23-24', label: '23-24' },
  {value: '22-23', label: '22-23' },
  // Add more evaluations here
];

const VerifiedIconWrapper = ({ verified }) => {
  const iconColor = verified ? 'green' : 'gray'; // Set the color based on the verified value
  return <VerifiedIcon htmlColor={iconColor} />;
  
};

function EmployeeProfile({ image }) {
  const containerStyle = {
    borderTop: '1px solid transparent', // Invisible border for separation
    marginTop: '1em', // Add space above the container
  };

  const [value, setValue] = useState('1');
  const [selectedYearEvaluation, setSelectedYearEvaluation] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleYearEvaluationChange = (event) => {
    setSelectedYearEvaluation(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmSendResults = () => {
    // Handle sending results here
    console.log('Sending results...');
    setOpenDialog(false);
    setOpenSecondDialog(true);
  };

  const handleSecondDialogClose = () => {
    setOpenSecondDialog(false);
  };

 // Create a reusable table function and call that function inside the Tabs component
  // const TableComponent = () => {
  //   const tableHeaderStyle = {
  //       backgroundColor: 'maroon',
  //       color: 'white',
  //   };

  //   const viewDetailsStyle = {
  //       color: 'maroon',
  //       textDecoration: 'underline',
  //       cursor: 'pointer',
  //   };
    
  //   const columnStyle = {
  //     width: '160px', // Adjust the width as needed (replace with desired width)
  //     textAlign: 'center',
  //     backgroundColor: 'maroon',
  //     color: 'white',
  //   };
  
  //   return (
  //       <TableContainer component={Paper}>
  //           <Table>
  //               <TableBody>
  //                   <TableRow>
  //                       <TableCell style={tableHeaderStyle}></TableCell>
  //                       <TableCell style={columnStyle}>Self</TableCell>
  //                       <TableCell style={columnStyle}>Office Head</TableCell>
  //                       <TableCell style={columnStyle}>Peer</TableCell>
  //                       <TableCell style={tableHeaderStyle}></TableCell> 
  //                   </TableRow>
  //                   <TableRow>
  //                       <TableCell>Values-based Performance</TableCell>
  //                       <TableCell>
  //                           {/* Display verified icon based on self performance */}
  //                           <VerifiedIconWrapper verified={true}  />
  //                       </TableCell>
  //                       <TableCell>
  //                           {/* Display verified icon based on office head performance */}
  //                           <VerifiedIconWrapper verified={true} />
  //                       </TableCell>
  //                       <TableCell>
  //                           {/* Display verified icon based on peer performance */}
  //                           <VerifiedIconWrapper verified={false} />
  //                       </TableCell>
  //                       <TableCell>
  //                           <a href="#" style={viewDetailsStyle}>View Details</a>
  //                       </TableCell>
  //                   </TableRow>
  //                   <TableRow>
  //                       <TableCell>Job-Based Performance</TableCell>
  //                       <TableCell>
  //                           {/* Display verified icon based on self job-based performance */}
  //                           <VerifiedIconWrapper verified={true} />
  //                       </TableCell>
  //                       <TableCell>
  //                           {/* Display verified icon based on office head job-based performance */}
  //                           <VerifiedIconWrapper verified={false} />
  //                       </TableCell>
  //                       <TableCell>
  //                           {/* Display gray icon for peer job-based performance */}
  //                           <VerifiedIconWrapper verified={false} />
  //                       </TableCell>
  //                       <TableCell>
  //                           <a href="#" style={viewDetailsStyle}>View Details</a>
  //                       </TableCell>
  //                   </TableRow>
  //               </TableBody>
  //           </Table>
  //       </TableContainer>
  //   );

  // };

  const TableComponent = () => {
    const tableHeaderStyle = {
      backgroundColor: 'maroon',
      color: 'white',
    };
  
    const viewDetailsStyle = {
      color: 'maroon',
      textDecoration: 'underline',
      cursor: 'pointer',
    };
  
    const columnStyle = {
      width: '160px', // Adjust the width as needed (replace with desired width)
      textAlign: 'center',
      backgroundColor: 'maroon',
      color: 'white',
    };
  
    const iconContainerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={tableHeaderStyle}></TableCell>
              <TableCell style={columnStyle}>
                <Box sx={iconContainerStyle}>
                  Self
                </Box>
              </TableCell>
              <TableCell style={columnStyle}>
                <Box sx={iconContainerStyle}>
                  Office Head
                </Box>
              </TableCell>
              <TableCell style={columnStyle}>
                <Box sx={iconContainerStyle}>
                  Peer
                </Box>
              </TableCell>
              <TableCell style={tableHeaderStyle}></TableCell>
            </TableRow>
            <TableRow>
            <TableCell>
              <strong>Values-based Performance</strong>
            </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={true} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={true} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={false} />
                </Box>
              </TableCell>
              <TableCell>
                <a href="#" style={viewDetailsStyle}>View Details</a>
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell>
              <strong>Job-based Performance</strong>
            </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={true} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={false} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={iconContainerStyle}>
                  <VerifiedIconWrapper verified={false} />
                </Box>
              </TableCell>
              <TableCell>
                <a href="#" style={viewDetailsStyle}>View Details</a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container maxWidth="lg" sx={{ width: '10000px' }} style={containerStyle}>
          <Box sx={{ mt: 1, mb: 2 }}>
            <h2>Employees</h2>
          </Box>

          <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2, backgroundColor: 'white', ml: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, backgroundColor: 'white', borderRadius: 2, p: 2, borderBottom: '2px solid #e0e0e0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
              <Box sx={{ ml: 2, mb: 2 }}>
                <Avatar alt="Employee" src={image} sx={{ width: 140, height: 140, mr: 2 }} />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" fontFamily="Poppins" fontWeight={500} mb={2}>ID: 1969</Typography>
                <Typography variant="body2" fontFamily="Poppins" fontWeight={500} mb={2}>Name: Ryan A. Musa</Typography>
                <Typography variant="body2" fontFamily="Poppins" fontWeight={500} mb={2}>Position: Junior Programmer</Typography>
                <Typography variant="body2" fontFamily="Poppins" fontWeight={500} mb={2}>
                  Department: Information System Development
                </Typography>
              </Box>
            </Box>

            <Box sx={{ borderTop: 'none', borderBottom: 'none', mt: 2, mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1 }}>
                <Typography variant="body2" fontFamily="Poppins" mb={.2}>Set Year Evaluation: </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl sx={{ m: 1, mr: 90, minWidth: 80, minHeight: 10 }} size="small">
                  <Select
                    id="year-evaluation"
                    value={selectedYearEvaluation}
                    onChange={handleYearEvaluationChange}
                    style={{ padding: 1, fontSize: 12, textAlign: 'left' }} // Apply custom styling here
                  >
                    {yearEvaluations.map(evaluation => (
                      <MenuItem value={evaluation.value} key={evaluation.value}>{evaluation.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="secondary" sx={{ textTransform: 'capitalize', fontSize: '0.8rem', width: '129px' }}>
                  View Evaluation
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <TabList onChange={handleChange} aria-label="lab API tabs example" indicatorColor="secondary" sx={{ borderBottom: 'none', textTransform: 'capitalize' }}>
                  {tabs.map(tab => (
                    <Tab label={tab.label} value={tab.value} key={tab.value} />
                  ))}
                </TabList>
                <TabPanel value="1">
                  <TableComponent />
                </TabPanel>
                <TabPanel value="2">
                  <TableComponent />
                </TabPanel>
                <TabPanel value="3">
                  <TableComponent />
                </TabPanel>
              </TabContext>
              <Button variant="contained" color="secondary" startIcon={<SendIcon sx={{ fontSize: 'smaller' }} />} sx={{ textTransform: 'capitalize', fontSize: '0.7rem', width: '129px', height: '37px', ml: 119.5 }} onClick={handleDialogOpen}>
                Send Results
              </Button>
            </Box>
          </Box>
        </Container>
      </div>

      {/* Dialog Component */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
        style={{ margin: '24px 0', paddingBottom: '36px' }}
      >
        <DialogTitle id="alert-dialog-title"
                    style={{ textAlign: 'center', backgroundColor: '#8b2500', padding: '40px 16px 0px 16px', borderBottom: '1px solid #e0e0e0', color: 'white' }}>
          
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center', padding: '24px' }}>
          <b style={{ fontSize: '24px', color: 'black', display: 'block', margin: '16px 0' }}>Confirm Sending Results</b>
          <DialogContentText id="alert-dialog-description" style={{ color: 'grey', textAlign: 'center', fontSize: '1rem' }}>
            Would you like to forward the results to the head?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', padding: '10px 10px 16px 10px' }}>
          <Button variant="contained" onClick={handleDialogClose} sx={{ textTransform: 'capitalize', fontSize: '1rem', width: '129px', height: '37px', backgroundColor: 'white', color: 'black', border: 'none', fontWeight: '600', '&:hover': { backgroundColor: '#f5f5f5' } }}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmSendResults} autoFocus sx={{ textTransform: 'capitalize', fontSize: '1rem', width: '129px', height: '37px', border: 'none', fontWeight: '600' }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second Dialog Component - Added after clicking send in the first dialog */}
      <Dialog
        open={openSecondDialog}
        onClose={handleSecondDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
        style={{ margin: '24px 0', paddingBottom: '36px' }}
      >
        <DialogTitle id="alert-dialog-title"
                    style={{ textAlign: 'center', backgroundColor: '#8b2500', padding: '40px 16px 0px 16px', borderBottom: '1px solid #e0e0e0', color: 'white' }}>
      
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center', padding: '24px' }}>
        <VerifiedIcon htmlColor="green" sx={{ fontSize: '3rem', mr: 1 }} />
        <b style={{ fontSize: '1.5rem', color: 'green', display: 'block', marginBottom: '16px' }}>SUCCESS</b>
        <DialogContentText id="alert-dialog-description" style={{ color: 'grey', textAlign: 'center', fontSize: '1rem' }}>
          Summary evaluation results successfully sent.
        </DialogContentText>
      </DialogContent>
        <DialogActions style={{ justifyContent: 'center', padding: '10px 10px 16px 10px' }}>
          <Button variant="contained" onClick={handleSecondDialogClose} autoFocus sx={{
            textTransform: 'capitalize',
            fontSize: '1rem',
            width: '129px',
            height: '37px',
            border: 'none',
            fontWeight: '600',
            backgroundColor: 'white',
            color: 'black',
            '&:hover': {
              backgroundColor: '#800000', // Maroon color
              color: 'white',
            },
          }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default EmployeeProfile;