import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginHeader = ({ isMobile }) => (
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Typography
      variant={isMobile ? 'h4' : 'h3'}
      component="h1"
      sx={{
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        mb: 1
      }}
    >
      Der Will
    </Typography>

    <Typography
      variant="body1"
      sx={{
        color: 'var(--color-text-secondary)',
        fontSize: isMobile ? '1rem' : '1.1rem'
      }}
    >
      Sistema de Gestión de Depósito
    </Typography>
  </Box>
);

export default LoginHeader;

