import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { apiUrl } from '../config/config';

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

  const getEndpoint = (period) => {
    switch (period) {
      case 'annual':
        return `${apiUrl}/evaluation/annualPerDept`;
      case 'thirdMonth':
        return `${apiUrl}evaluation/thirdMonthPerDept`;
      case 'fifthMonth':
        return `${apiUrl}evaluation/fifthMonthPerDept`;
      default:
        return `${apiUrl}evaluation/annualPerDept`;
    }
  };

  useEffect(() => {
    const endpoint = getEndpoint(period);
    axios.get(endpoint)
      .then(response => {
        if (response.data && response.data.length > 0) {
          setData(response.data);
        } else {
          setData([]); // Reset data if response is empty
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setData([]); // Reset data on error
        setIsLoading(false);
      });
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    setIsLoading(true); // Set loading state to true while fetching new data
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
        <div>Loading...</div>
      ) : data.length === 0 ? (
        <div>No data available for the selected period</div>
      ) : (
        <Box sx={{ overflowY: 'auto', maxHeight: 342 }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="department"
                tick={({ x, y, payload }) => (
                  <text x={x} y={y} dy={16} textAnchor="end" fill="#666" fontSize={13}>
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip />
              <Legend />
              {data.map((entry, index) => (
                <Bar key={entry.department} dataKey="count" fill={getColor(index)} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default AccomplishmentRateChart;
