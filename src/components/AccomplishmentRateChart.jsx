import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Box, Select, MenuItem, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const BorderlessSelect = styled(Select)({
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
});

const colorPalette = ['#C97338', '#A54D27', '#65371F', '#282119'];

const getColor = (index) => colorPalette[index % colorPalette.length];

const AccomplishmentRateChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('annual');
  const [error, setError] = useState(null);

  const getEndpoint = (period) => {
    switch (period) {
      case 'annual':
        return 'http://localhost:8080/evaluation/annualPerDept';
      case 'thirdMonth':
        return 'http://localhost:8080/evaluation/thirdMonthPerDept';
      case 'fifthMonth':
        return 'http://localhost:8080/evaluation/fifthMonthPerDept';
      default:
        return 'http://localhost:8080/evaluation/annualPerDept';
    }
  };

  useEffect(() => {
    const endpoint = getEndpoint(period);
    setIsLoading(true);
    setError(null);
    axios.get(endpoint)
      .then(response => {
        setData(response.data || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setIsLoading(false);
      });
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const chartHeight = data.length > 10 ? data.length * 40 : 342;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
        <Typography sx={{ fontWeight: 500 }} fontSize={15} fontFamily="Poppins">
          Accomplishment Rate Per Department
        </Typography>
        <BorderlessSelect
          value={period}
          onChange={handlePeriodChange}
          displayEmpty
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="annual">Annual</MenuItem>
          <MenuItem value="thirdMonth">3rd Month</MenuItem>
          <MenuItem value="fifthMonth">5th Month</MenuItem>
        </BorderlessSelect>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={chartHeight}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={chartHeight}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={chartHeight}>
          <Typography>No data available for the selected period</Typography>
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto', maxHeight: 342 }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="department" label={{ value: 'Department', position: 'insideBottomRight', offset: 0 }} />
              <YAxis type="number" tickFormatter={(tick) => Math.floor(tick)} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={colorPalette[0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default AccomplishmentRateChart;
