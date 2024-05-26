import React, { useState } from 'react';
import { Modal, Box, Typography, Divider, Paper, Table, TableHead,TableBody, TableCell, TableRow, TableContainer, Tabs, Tab } from '@mui/material';
import Chart from 'react-apexcharts';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ViewResults = ({ open, onClose, employee }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!employee) return null;

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Example chart options and series
  const JBPChartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    colors: ['#151515', '#FF0000', '#FCDC2A'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Values-Based Performance', 'Jobs-Based Performance'],
    },
    yaxis: {
      title: {
        text: 'Scores (0 - 5)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " points"
        }
      }
    }
  };

  const VBPAChartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    colors: ['#151515', '#FF0000', '#FCDC2A'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Culture of Excellence', 'Integrity', 'Teamwork', 'Universality'],
    },
    yaxis: {
      title: {
        text: 'Scores (0 - 5)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " points"
        }
      }
    }
  };

  const JBPChartSeries = [{
    name: 'Head',
    data: [4.4, 5],
  }, {
    name: 'Self',
    data: [4.0, 3]
  }, {
    name: 'Peer',
    data: [4.4, 4.3]
  }];

  const VBPChartSeries = [{
    name: 'Head',
    data: [4.4, 4, 4.4, 4.6],
  }, {
    name: 'Self',
    data: [4.0, 3, 4.3, 4.8]
  }, {
    name: 'Peer',
    data: [4.4, 4.6, 3, 4.6]
  }];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          width: '80vw',
          height: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#8C383E',
            color: 'white',
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            height: '48px',
            borderBottom: '3px solid #F8C702'
          }}
        >
          View Results
        </Box>

        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange} centered >
          <Tab label="3rd Month"  />
          <Tab label="5th Month" />
        </Tabs>

        {/* Tab Content */}
        <div className='mx-4 mb-4 border-2 border-gray-400 rounded-lg'>
        <TabPanel value={tabIndex} index={0}>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Poppins' }}>
            Expanded Administrative Performance Assessment (e-AEPA) :
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mt: 1, fontFamily: 'Poppins' }}>
            3RD MONTH EVALUATION RESULT
          </Typography>
          <Divider sx={{ borderBottom: '3px solid', width: '80%', margin: 'auto', my: 2 }} />
          <div className= "flex">
          {/* Employee Info Table */}
          <div className='me-auto'>
          <TableContainer  sx={{ width: 500, maxHeight: 220, mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
            <Typography sx={{
              bgcolor: '#808080',
              color: 'white',
              p: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              fontFamily: 'Poppins',
            }}>
              Employee Identifying Information
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee ID</TableCell>
                  <TableCell sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>{employee.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  sx={{width: 'auto',border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee Name</TableCell>
                  <TableCell  sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>{employee.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{width: 'auto',border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee Position</TableCell>
                  <TableCell sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>ETO - Staff</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </div>
          <div className='mr-4'>
          {/* Weight & Overall AEPA Table */}
          <TableContainer sx={{ maxWidth: 500, height: 'auto', mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Weight</TableCell>
                <TableCell sx={{ backgroundColor: '#151515', textAlign: 'center', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Overall AEPA</TableCell>
                <TableCell sx={{ backgroundColor: 'grey', color: 'black', border: '1px solid #ccc' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins'}}>60%</TableCell>
                <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins' }}>Values-Based Performance Assessment</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins'}} align="right">4.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins'}}>40%</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins'}}>Job-Based Performance Assessment</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins'}} align="right">4.50</TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </TableContainer>
      </div>
    </div>
  

  {/* Performance Appraisal Table */}
    <TableContainer sx={{ maxWidth: 500, maxHeight: 220, mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: 'auto', backgroundColor: 'grey', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Rating Period</TableCell>
            <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>3rd and 5th Month Evaluation</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: 'auto', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Date of Appraisal</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins' }}>02/20/2024</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: 'auto', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Date Hired</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins' }}>02/20/2024</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>


          {/* Flex Container for Charts */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {/* First Chart */}
            <Box sx={{ width: '50%', p: 1 }}>
              <Box sx={{ backgroundColor: '#E81B1B', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', height: '30px', borderBottom: '3px solid #F8C702' }}>
                Multi-Reference Performance Appraisal
              </Box>
              <Chart options={JBPChartOptions} series={JBPChartSeries} type="bar" height={320} />
            </Box>

            {/* Second Chart */}
            <Box sx={{ width: '50%', p: 1 }}>
              <Box sx={{ backgroundColor: '#E81B1B', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', height: '30px', borderBottom: '3px solid #F8C702' }}>
                Visualized Values-Based Performance Assessment
              </Box>
              <Chart options={VBPAChartOptions} series={VBPChartSeries} type="bar" height={320} />
            </Box>
          </Box>
        </TabPanel>
      </div>

        <TabPanel value={tabIndex} index={1}>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Poppins' }}>
            Expanded Administrative Performance Assessment (e-AEPA) :
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mt: 1, fontFamily: 'Poppins' }}>
            5TH MONTH EVALUATION RESULT
          </Typography>
          <Divider sx={{ borderBottom: '3px solid', width: '80%', margin: 'auto', my: 2 }} />

          {/* Similar content for the 5th month can be added here */}
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            Content for the 5th month evaluation goes here.
          </Typography>
        </TabPanel>
      </Box>
    </Modal>
    
  );
};

export default ViewResults;