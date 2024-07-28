import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { apiUrl } from '../config/config';

const ThirdMonthCompletion = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedCount = async () => {
            try {
                const response = await fetch(`${apiUrl}evaluation/thirdMonthStatus`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched 3rd month data:', data);

                if (data.completed === undefined) {
                    throw new Error('Unexpected 3rd month data format');
                }

                setCount(data.completed);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching the count:', error);
                setLoading(false);
            }
        };

        fetchCompletedCount();
    }, []);

    if (loading) {
        return <Typography variant="body2" color="textSecondary">Loading...</Typography>;
    }

    return (
        <Typography variant="h3" sx={{ fontFamily: 'Poppins', color: '#CD1A30', fontWeight: 'bold'}}>
            {count}
        </Typography>
    );
};

export default ThirdMonthCompletion;

