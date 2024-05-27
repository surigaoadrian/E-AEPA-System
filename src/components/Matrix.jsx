import React from 'react';
import Chart from 'react-apexcharts';
import matrix from "../assets/matrix.png";
import { Box } from '@mui/material';


const Matrix = () => {
  // Specific dummy data for one point
  const employeeData = [
    { id: 1, valuesPerformance: 4.5, jobsPerformance: 5.0 }
  ];

  const chartOptions = {
    chart: {
      type: 'scatter',
      height: 350,
      zoom: {
        type: 'xy',
        enabled: false
      },
      toolbar: {
        show: false // Hides the toolbar for a cleaner look
      },
      background: 'transparent' // Important for showing the image behind the chart
    },
    xaxis: {
      tickAmount: 4,
      min: 1,
      max: 5,
      title: {
        text: 'Values-Based Performance'
      }
    },
    yaxis: {
      tickAmount: 4,
      min: 1,
      max: 5,
      title: {
        text: 'Jobs-Based Performance'
      }
    },
    markers: {
      size: 5,
      colors: ['#f00'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        formatter: function(val) {
          return val;
        }
      },
      y: {
        show: true,
        formatter: function(val) {
          return val;
        }
      }
    }
  };

  const series = [{
    name: 'Employee Performance',
    data: employeeData.map(emp => [emp.valuesPerformance, emp.jobsPerformance])
  }];

  return (
    <div>
    <Box className="mb-4" sx={{ backgroundColor: '#E81B1B', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', height: '30px', borderBottom: '3px solid #F8C702' }}>
    Career Development Conversation Matrix
  </Box>
    <div className="mx-12" style={{ // Ensure this path points to your actual background image 
      backgroundImage: `url(${matrix})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      border: '5px solid red', // Temporary border to confirm visibility
      height: '500px',
      width: '700px',
      margin: '0 auto', // Centers the chart horizontally
    }}>
      <Chart options={chartOptions} series={series} type="scatter" height={500} width={700} />
    </div>
    </div>
  );
};

export default Matrix;
