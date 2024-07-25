import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#FFBA00', '#597001'];

const EmployeeStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [probationaryRes, regularRes] = await Promise.all([
          axios.get('http://localhost:8080/user/countProbationaryUsers'),
          axios.get('http://localhost:8080/user/getRegularEmployees')
        ]);

        const probationaryCount = probationaryRes.data;
        const regularCount = regularRes.data;

        const total = probationaryCount + regularCount;

        const chartData = [
          { name: 'Probationary', value: (probationaryCount / total) * 100, count: probationaryCount, color: COLORS[0] },
          { name: 'Regular', value: (regularCount / total) * 100, count: regularCount, color: COLORS[1] }
        ];

        console.log('Fetched Data:', chartData); // Logging the fetched data
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderCustomizedLabel = ({ name, value, count }) => {
    return `${name}: ${value.toFixed(2)}% (${count})`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
            label={renderCustomizedLabel}
            labelStyle={{ fontSize: '10px' }} // Adjust font size here
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value.toFixed(2)}% (${props.payload.count})`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeStatusChart;

