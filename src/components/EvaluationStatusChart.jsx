import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { apiUrl } from '../config/config';

const EvaluationStatusChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the 3rd month evaluation status
                const thirdMonthResponse = await fetch(`${apiUrl}evaluation/thirdMonthStatus`);
                if (!thirdMonthResponse.ok) {
                    throw new Error(`HTTP error! status: ${thirdMonthResponse.status}`);
                }
                const thirdMonthData = await thirdMonthResponse.json();

                // Fetch the 5th month evaluation status
                const fifthMonthResponse = await fetch(`${apiUrl}evaluation/fifthMonthStatus`);
                if (!fifthMonthResponse.ok) {
                    throw new Error(`HTTP error! status: ${fifthMonthResponse.status}`);
                }
                const fifthMonthData = await fifthMonthResponse.json();

                // Fetch the total number of probationary employees
                const totalEmployeesResponse = await fetch(`${apiUrl}user/countProbationaryUsers`);
                if (!totalEmployeesResponse.ok) {
                    throw new Error(`HTTP error! status: ${totalEmployeesResponse.status}`);
                }
                const totalEmployees = await totalEmployeesResponse.json();

                // Calculate percentages
                const thirdMonthCompletedPercentage = totalEmployees > 0 ? ((thirdMonthData.completed / totalEmployees) * 100).toFixed(2) : 0;
                const thirdMonthNotCompletedPercentage = totalEmployees > 0 ? ((thirdMonthData.notCompleted / totalEmployees) * 100).toFixed(2) : 0;
                const fifthMonthCompletedPercentage = totalEmployees > 0 ? ((fifthMonthData.completed / totalEmployees) * 100).toFixed(2) : 0;
                const fifthMonthNotCompletedPercentage = totalEmployees > 0 ? ((fifthMonthData.notCompleted / totalEmployees) * 100).toFixed(2) : 0;

                // Combine data into chart format
                const chartData = [
                    {
                        evaluation: '3rd Evaluation',
                        completed: parseFloat(thirdMonthCompletedPercentage) || 0,
                        notCompleted: parseFloat(thirdMonthNotCompletedPercentage) || 0,
                    },
                    {
                        evaluation: '5th Evaluation',
                        completed: parseFloat(fifthMonthCompletedPercentage) || 0,
                        notCompleted: parseFloat(fifthMonthNotCompletedPercentage) || 0,
                    },
                ];
                setData(chartData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <ResponsiveBar
            data={data}
            keys={['completed', 'notCompleted']}
            indexBy="evaluation"
            margin={{ top: 20, right: 20, bottom: 60, left: 120 }}
            padding={0.3}
            layout="horizontal"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ id }) => (id === 'completed' ? '#74A587' : '#E05D5D')}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 1,
                tickRotation: 0,
                legend: 'Percentage',
                legendPosition: 'middle',
                legendOffset: 22,
                tickValues: [0, 20, 40, 60, 80, 100], // Ensure tick values from 0 to 100
                format: (value) => `${value}%`,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Evaluation',
                legendPosition: 'middle',
                legendOffset: -100,
                tickValues: data.map(d => d.evaluation), // Ensure tick values are based on evaluation categories
                renderTick: ({ opacity, textAnchor, textBaseline, value, x, y, onMouseEnter, onMouseMove, onMouseLeave }) => (
                    <g
                        transform={`translate(${x},${y})`}
                        style={{ opacity }}
                        onMouseEnter={onMouseEnter}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
                    >
                        <text
                            alignmentBaseline={textBaseline}
                            textAnchor={textAnchor}
                            style={{ fontSize: 14, fontWeight: 'bold' ,fontSize:'12px'}} // Increase font size and make bold
                        >
                            {value}
                        </text>
                    </g>
                )
            }}
            label={(d) => (
                <tspan style={{ fill: '#ffffff', fontWeight: 'bold' }}>{`${d.value}%`}</tspan>
            )}
            labelSkipWidth={12}
            labelSkipHeight={12}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-left',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 50,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            role="application"
            barAriaLabel={(e) => `${e.id}: ${e.formattedValue}% in evaluation: ${e.indexValue}`}
        />
    );
};

export default EvaluationStatusChart;
