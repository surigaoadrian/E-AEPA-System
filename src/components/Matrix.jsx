import React from 'react';
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Box } from '@mui/material';
import matrix from "../assets/matrixx.png";
import arrow from "../assets/arrow.png";
import boxes from "../assets/matrixboxes.png";
import bottomArrow from "../assets/bottomarrow.png";

// Custom shape function that renders an emoji
const renderPin = (props) => {
  const { cx, cy } = props;
  return <text x={cx} y={cy} dy={5} dx={-15} fontSize={20} >✅</text>;
};

// Custom tooltip function
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #999', padding: '8px', fontSize:'0.8em' }}>
        <p>Values-Based Performance: {payload[0].payload.valuesPerformance}</p>
        <p>Jobs-Based Performance: {payload[0].payload.jobsPerformance}</p>
      </div>
    );
  }
  return null;
};

const Matrix = () => {
  const employeeData = [
    { id: 1, valuesPerformance: 3.5, jobsPerformance: 4.0 }
  ];

  return (
    <div>
      <Box className="mb-4" sx={{ 
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
        Career Development Conversation Matrix
      </Box>
      <div className='flex justify-center'>
      <img src={arrow} style={{ width: '100px', height: '500px' }} />
      <div className='mt-10' style={{ 
        height: '500px',
        width: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 15,
              bottom: 20,
              left: 10,
            }}
          >
            <defs>
              <pattern id="backgroundImage" patternUnits="userSpaceOnUse" width="100%" height="100%">
                <image href={matrix} x="0" y="0" width="100%" height="100%" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundImage)" />
            
            <XAxis type="number" dataKey="valuesPerformance" name="Values-Based Performance" domain={[1, 5]}>
              <Label value="Values-Based Performance" offset={-20} position="insideBottom" style={{ fontWeight:'bold',textAnchor: 'middle' }} />
            </XAxis>
            <YAxis type="number" dataKey="jobsPerformance" name="Jobs-Based Performance" domain={[1, 5]}>
              <Label value="Jobs-Based Performance" angle={-90} position="insideLeft" offset={10} style={{ fontWeight:'bold',textAnchor: 'middle' }}/>
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Employee Performance" data={employeeData} fill="#f00" shape={renderPin} />
          </ScatterChart>
        </ResponsiveContainer>
        </div>
        <img src={boxes} className='ml-16' style={{ width: 'auto', height: '500px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight:'124px' }}>
  <img src={bottomArrow} alt="Bottom Arrow" style={{ width: 'auto', height: '100px' }} />
</div>

    </div>
  );
};

export default Matrix;
