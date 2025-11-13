import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginFooter = () => (
  <Box sx={{ textAlign: 'center', mt: 3 }}>
    <Typography
      variant="body2"
      sx={{
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem'
      }}
    >
      © 2024 Der Will. Todos los derechos reservados.
    </Typography>
  </Box>
);

export default LoginFooter;

