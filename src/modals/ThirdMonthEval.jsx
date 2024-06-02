import React, { useState } from 'react';
import { Modal, Box, Typography, Divider, Paper, Table, TableHead,TableBody, TableCell, TableRow, TableContainer, Tabs, Tab } from '@mui/material';
import Chart from 'react-apexcharts';
import Matrix from "./Matrix";

function ThirdMonthEval() {
  return (
    <>
      {/* 3RD EVALUATION TAB*/}
      <div className='mx-4 mb-4'>
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
        <TableContainer  sx={{ width: 500, maxHeight: 'auto', mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
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
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{width: '40%',border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee ID</TableCell>
                <TableCell sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>{employee.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell  sx={{width: '40%',border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee Name</TableCell>
                <TableCell  sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>{employee.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: '40%',border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>Employee Position</TableCell>
                <TableCell sx={{border: '1px solid #ccc' ,fontFamily: 'Poppins'}}>ETO - Staff</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        <div className='mr-4'>

    {/* Weight & Overall AEPA Table */}
        <TableContainer sx={{ maxWidth: 500, height: 'auto', mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
        <Table size="small">
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


{/* Rating Period Table */}
  <TableContainer sx={{ maxWidth: 500, maxHeight: 220, mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell sx={{ width: '40%', backgroundColor: 'grey', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Rating Period</TableCell>
          <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins' }}>3rd Month Evaluation</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ width: '40%', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Date of Appraisal</TableCell>
          <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins' }}>02/20/2024</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ width: '40%', border: '1px solid #ccc', fontFamily: 'Poppins' }}>Date Hired</TableCell>
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

{/* Performance Appraisal Average Table */}
<Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
<Box sx={{ width: '45%', p: 1 }}>
<TableContainer sx={{ maxWidth: 'auto', maxHeight: '100%', mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
  <Table size="small">
    <TableHead>
      <TableRow >  
        <TableCell sx={{fontFamily: 'Poppins'}}>Weight of Reference</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">60%</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">20%</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">20%</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>  
        <TableCell sx={{backgroundColor: 'grey', color: 'white', border: '1px solid #ccc', fontFamily: 'Poppins'}}>Assessment Factor</TableCell>
        <TableCell sx={{ backgroundColor: '#151515', color: 'white', fontWeight: 'bold', border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">Head</TableCell>
        <TableCell sx={{ backgroundColor: '#FF0000', color: 'white', fontWeight: 'bold',border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">Self</TableCell>
        <TableCell sx={{ backgroundColor: '#FCDC2A', color: 'black', fontWeight: 'bold',border: '1px solid #ccc', fontFamily: 'Poppins'}} align="center">Peer</TableCell>
      </TableRow>
      <TableRow>  
        <TableCell sx={{fontFamily: 'Poppins'}}>Values-Based Performance</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
      </TableRow>
      <TableRow>  
        <TableCell sx={{ fontFamily: 'Poppins' }}>Job-Based Performance</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>5.00</TableCell>
        <TableCell sx={{ border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
      </TableRow>
      <TableRow>  
        <TableCell sx={{backgroundColor: 'grey', color: 'white', fontWeight: 'bold', fontFamily: 'Poppins'}}>Reference Average</TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>4.70</TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc', fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
</Box>

{/* Overall VBPA Average Table */}
<Box sx={{ width: '45%', p: 1 }}>
  <TableContainer sx={{ maxWidth: 'auto', maxHeight: 'auto', mb: 2, mx: 1, border: '2px solid #ccc', borderRadius: '4px' }}>
  <Table size="small">
    <TableHead>
      <TableRow>
      <TableCell sx={{backgroundColor: 'grey', color: 'white', fontWeight: 'bold', fontFamily: 'Poppins'}}>Assessment Factor</TableCell>
        <TableCell sx={{ backgroundColor: '#151515', color: 'white', fontWeight: 'bold', border: '1px solid #ccc' , fontFamily: 'Poppins'}} align="center">Head</TableCell>
        <TableCell sx={{ backgroundColor: '#FF0000', color: 'white', fontWeight: 'bold',border: '1px solid #ccc' , fontFamily: 'Poppins'}} align="center">Self</TableCell>
        <TableCell sx={{ backgroundColor: '#FCDC2A', color: 'black', fontWeight: 'bold',border: '1px solid #ccc' , fontFamily: 'Poppins'}} align="center">Peer</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    <TableRow> 
    <TableCell sx={{fontFamily: 'Poppins'}}>Culture of Excellence</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{fontFamily: 'Poppins'}}>Integrity</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{fontFamily: 'Poppins'}}>Teamwork</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>5.00</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{fontFamily: 'Poppins'}}>Universality</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>5.00</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{backgroundColor: 'grey', color: 'white', fontWeight: 'bold', fontFamily: 'Poppins'}}>Overall VBPA</TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}></TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.70</TableCell>
        <TableCell sx={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold',border: '1px solid #ccc' , fontFamily: 'Poppins',textAlign:'center'}}>4.50</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
</Box>
</Box>

<Matrix/> 
      </TabPanel>
    </div>
    </>
);
};

export default ThirdMonthEval;


