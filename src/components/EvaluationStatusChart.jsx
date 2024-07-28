import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const EvaluationStatusChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [thirdMonthResponse, fifthMonthResponse, totalEmployeesResponse] = await Promise.all([
                    fetch('http://localhost:8080/evaluation/thirdMonthStatus'),
                    fetch('http://localhost:8080/evaluation/fifthMonthStatus'),
                    fetch('http://localhost:8080/user/countProbationaryUsers'),
                ]);

                if (!thirdMonthResponse.ok || !fifthMonthResponse.ok || !totalEmployeesResponse.ok) {
                    throw new Error('One or more fetch requests failed');
                }

                const [thirdMonthData, fifthMonthData, totalEmployees] = await Promise.all([
                    thirdMonthResponse.json(),
                    fifthMonthResponse.json(),
                    totalEmployeesResponse.json(),
                ]);

                const calculatePercentages = (completed, total) => {
                    const completedPercentage = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;
                    const notCompletedPercentage = total > 0 ? (((total - completed) / total) * 100).toFixed(2) : 0;
                    return {
                        completedPercentage: parseFloat(completedPercentage),
                        notCompletedPercentage: parseFloat(notCompletedPercentage),
                    };
                };

                const thirdMonthPercentages = calculatePercentages(thirdMonthData.completed, totalEmployees);
                const fifthMonthPercentages = calculatePercentages(fifthMonthData.completed, totalEmployees);

                const chartData = [
                    {
                        evaluation: '3rd Evaluation',
                        completed: thirdMonthPercentages.completedPercentage,
                        notCompleted: thirdMonthPercentages.notCompletedPercentage,
                    },
                    {
                        evaluation: '5th Evaluation',
                        completed: fifthMonthPercentages.completedPercentage,
                        notCompleted: fifthMonthPercentages.notCompletedPercentage,
                    },
                ];

                setData(chartData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendPosition: 'middle',
                legendOffset: 32,
                tickValues: [0, 20, 40, 60, 80, 100],
                format: (value) => `${value}%`,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Evaluation',
                legendPosition: 'middle',
                legendOffset: -100,
                tickValues: data.map(d => d.evaluation),
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
                            style={{ fontSize: 12, fontWeight: 'bold' }}
                        >
                            {value}
                        </text>
                    </g>
                ),
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

