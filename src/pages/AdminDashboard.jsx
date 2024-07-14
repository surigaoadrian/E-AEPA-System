import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Box, Grid, Typography, Paper, Container } from '@mui/material';
import ProbationaryCount from '../components/ProbationaryCount';
import ForRecommendationCount from '../components/ForRecommendationCount';
import EvaluationStatusChart from '../components/EvaluationStatusChart';

function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, 'MMMM dd, yyyy | EEEE');
    setCurrentDate(formattedDate);
  }, []);

  return (
    <Container maxWidth="120px" sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5" fontWeight="bolder" fontFamily="Poppins">Dashboard</Typography>
        <Typography variant="h7" fontFamily="Poppins">{currentDate}</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2 , boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)'}}>
            <Typography sx={{ textAlign: 'center', fontWeight: 500 }} fontSize={13} gutterBottom fontFamily="Poppins">Evaluation Status for 3rd and 5th Month</Typography>
            {/* Placeholder for the chart */}
            <Box
              sx={{
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
            <EvaluationStatusChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper elevation={3} sx={{ padding: 1,borderRadius: 2 ,boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)'}}>
            <Typography sx={{ textAlign: 'center', fontWeight: 500 }} fontSize={16} gutterBottom fontFamily="Poppins">Probationary</Typography>
            {/* Placeholder for the chart */}
            <Box
              sx={{
                height: 110,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
             <ProbationaryCount />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2,boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
            <Typography sx={{ textAlign: 'center', fontWeight: 500 }} fontSize={16} gutterBottom fontFamily="Poppins">For Rcommendation</Typography>
            {/* Placeholder for the chart */}
            <Box
              sx={{
                height: 110,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                <ForRecommendationCount />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2,boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
            <Typography sx={{fontWeight: 500 }} fontSize={15} gutterBottom fontFamily="Poppins">Employee Status</Typography>
            {/* Placeholder for the chart */}
            <Box
              sx={{
                height:338,
                backgroundColor: '#E0E0E0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
              Chart goes here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ marginTop: '-38px'}}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2,boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)'}}>
            <Typography sx={{fontWeight: 500 }} fontSize={15} gutterBottom fontFamily="Poppins">Accomplishment Rate Per Department</Typography>
            {/* Placeholder for the chart */}
            <Box
              sx={{
                height: 376,
                backgroundColor: '#E0E0E0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Chart goes here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
export default AdminDashboard;
