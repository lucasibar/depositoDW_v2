import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const TabPanel = ({ children, value, index, ...other }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`calidad-tabpanel-${index}`}
      aria-labelledby={`calidad-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: isMobile ? 2 : 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel; 