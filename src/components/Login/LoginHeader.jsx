import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginHeader = () => (
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Typography variant="h3" component="h1" style={{fontWeight: 700, color: 'var(--color-text-primary)', mb: 1}}> 
      Der Will
    </Typography>
    <Typography variant="body1" component="p" style={{color: 'var(--color-text-secondary)', fontSize: '1.1rem'}}>
      Sistema de Gestión de Depósito
    </Typography>
  </Box>
);

export default LoginHeader;

