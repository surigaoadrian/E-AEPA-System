import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

const AnnualCompletion = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/evaluation/annualCompleted');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched Annual data:', data);

                if (data.completed === undefined) {
                    throw new Error('Unexpected Annual data format');
                }

                setCount(data.completed);
            } catch (error) {
                console.error('Error fetching the count:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedCount();
    }, []);

    if (loading) {
        return <Typography variant="body2" color="textSecondary">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="body2" color="error">{error}</Typography>;
    }

    return (
        <Typography variant="h3" sx={{ fontFamily: 'Poppins', color: '#121212', fontWeight: 'bold' }}>
            {count}
        </Typography>
    );
};

export default AnnualCompletion;
