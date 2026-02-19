
import React from 'react';
import { Box } from '@mui/material';
import { ConsultaStock } from '../components/ConsultaStock/ConsultaStock';

export const ConsultaStockPage = () => {
    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <ConsultaStock />
        </Box>
    );
};
