import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Box, Grid, Typography, Paper, Container } from '@mui/material';
import EvaluationStatusChart from '../components/EvaluationStatusChart';
import EmployeeStatusChart from '../components/EmployeeStatusChart';
import AccomplishmentRateChart from '../components/AccomplishmentRateChart';
import ThirdMonthCompletion from '../components/ThirdMonthCompletion';
import FifthMonthCompletion from '../components/FifthMonthCompletion';
import AnnualCompletion from '../components/AnnualCompletion';

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
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
            <Typography sx={{ textAlign: 'center', fontWeight: 500 }} fontSize={13} gutterBottom fontFamily="Poppins">Evaluation Status for 3rd and 5th Month</Typography>
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
        <Grid item container spacing={2} xs={12} md={6} lg={6}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
              <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">3rd Evaluation Completion</Typography>
              <Box
                sx={{
                  height: 92,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1,
                }}
              >
                <ThirdMonthCompletion />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
              <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">5th Evaluation Completion</Typography>
              <Box
                sx={{
                  height: 92,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  <FifthMonthCompletion />
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
              <Typography sx={{ textAlign: 'center', fontWeight: 600 }} fontSize={12} gutterBottom fontFamily="Poppins">Annual Evaluation Completion</Typography>
              <Box
                sx={{
                  height: 92,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1,
                }}
              >
                <AnnualCompletion />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
            <Typography sx={{ fontWeight: 500 }} fontSize={20} gutterBottom fontFamily="Poppins">Employee Status</Typography>
            <Box
              sx={{
                height: 338,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
              }}
            >
              <EmployeeStatusChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ marginTop: '-23px' }}>
          <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, boxShadow: '0 10px 20px -20px rgba(253, 10, 0.9, 0.9)' }}>
            <AccomplishmentRateChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;

