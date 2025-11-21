import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingButton = ({ loading, loadingText, children, size = 20, color = 'white' }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={size} sx={{ color }} />
        <span>{loadingText}</span>
      </Box>
    );
  }

  return children;
};

export default LoadingButton;

