import React from 'react';
import { Box, TextField, Grid, Typography } from '@mui/material';

const ConsolidatedResults = () => {
  return (
<div>
<Box className="mb-4 mt-14" sx={{ 
        backgroundColor: '#E81B1B', 
        color: 'white', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        height: '30px', 
        borderBottom: '3px solid #F8C702'
      }}>
        Inputs from Immediate Head or Designated Supervisor
      </Box>
      <div className='flex'>
      <Typography sx={{backgroundColor: '#EAB4CF', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        height: '40px', 
        width: '50%',}} >3rd Month</Typography>
    
    <Typography sx={{backgroundColor: '#C53880', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        height: '40px', 
        width: '50%',}} >5th Month</Typography>
        </div>
{/* [GAP] */}
<Typography  sx={{backgroundColor: 'black',
color: 'white',
fontSize: '1rem', 
fontWeight: 'bold', 
height: '40px', 
display: 'flex',       
alignItems: 'center',   
width: '100%'}} > &nbsp; [GAP] Describe areas you feel require improvement in terms of your STAFF's professional capabilities. </Typography>

<div className='flex space-x-4 -mt-2'>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
</div>
{/* [TARGET]  */}
<Typography  sx={{backgroundColor: 'black',
color: 'white',
fontSize: '1rem', 
fontWeight: 'bold', 
height: '40px', 
display: 'flex',       
alignItems: 'center',   
width: '100%'}} > &nbsp; [TARGET] What should be your STAFF's career goals for the semester? </Typography>

<div className='flex space-x-4 -mt-2'>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
</div>
{/* [ACTION/S] */}
<Typography  sx={{backgroundColor: 'black',
color: 'white',
fontSize: '1rem', 
fontWeight: 'bold', 
height: '40px', 
display: 'flex',       
alignItems: 'center',   
width: '100%'}} > &nbsp; [ACTION/S] What could your STAFF, you as Immediate Head or CIT management do to best support your STAFF in accomplishing these goals? </Typography>

<div className='flex space-x-4 -mt-2'>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
<TextField
  variant="outlined"
  fullWidth
  multiline
  rows={4}
  margin="normal"
/>
</div>
    </div>
);
}

export default ConsolidatedResults;