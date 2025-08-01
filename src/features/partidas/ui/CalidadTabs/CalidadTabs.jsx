import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography 
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CalidadTabs = ({ 
  tabValue, 
  onTabChange, 
  partidasEnCuarentenaCount, 
  partidasAprobadasCount 
}) => {
  const a11yProps = (index) => ({
    id: `calidad-tab-${index}`,
    'aria-controls': `calidad-tabpanel-${index}`,
  });

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={tabValue} 
        onChange={onTabChange} 
        aria-label="calidad tabs"
        sx={{
          '& .MuiTab-root': {
            minHeight: 64,
            fontSize: '1rem',
            fontWeight: 500,
          },
          '& .Mui-selected': {
            color: '#2ecc71',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#2ecc71',
          }
        }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              <Typography>En Cuarentena ({partidasEnCuarentenaCount})</Typography>
            </Box>
          } 
          {...a11yProps(0)} 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon />
              <Typography>Partidas Aprobadas ({partidasAprobadasCount})</Typography>
            </Box>
          } 
          {...a11yProps(1)} 
        />
      </Tabs>
    </Box>
  );
};

export default CalidadTabs; 