import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CalidadTabs = ({ 
  tabValue, 
  onTabChange, 
  partidasEnCuarentenaCount, 
  partidasAprobadasCount 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const a11yProps = (index) => ({
    id: `calidad-tab-${index}`,
    'aria-controls': `calidad-tabpanel-${index}`,
  });

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'var(--color-divider)',
      mb: 2,
      width: '100%',
      maxWidth: '100%'
    }}>
      <Tabs 
        value={tabValue} 
        onChange={onTabChange} 
        aria-label="calidad tabs"
        variant={isMobile || isTablet ? "fullWidth" : "standard"}
        sx={{
          width: '100%',
          '& .MuiTab-root': {
            minHeight: isMobile ? 56 : isTablet ? 60 : 64,
            fontSize: isMobile ? '0.875rem' : isTablet ? '0.9rem' : '1rem',
            fontWeight: 500,
            textTransform: 'none',
            color: 'var(--color-text-secondary)',
            '&.Mui-selected': {
              color: 'var(--color-primary)',
              fontWeight: 600
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--color-primary)',
            height: 3
          },
          '& .MuiTabs-flexContainer': {
            width: '100%'
          }
        }}
      >
        <Tab 
          label={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 0.5 : isTablet ? 0.75 : 1,
              flexDirection: isMobile ? 'column' : 'row',
              width: '100%',
              justifyContent: 'center'
            }}>
              <WarningIcon sx={{ fontSize: isMobile ? 18 : isTablet ? 19 : 20 }} />
              <Box sx={{ 
                textAlign: isMobile ? 'center' : 'left',
                minWidth: 0,
                flex: 1
              }}>
                <Typography 
                  variant={isMobile ? "caption" : isTablet ? "body2" : "body2"} 
                  sx={{ 
                    fontWeight: 'inherit',
                    fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem',
                    lineHeight: 1.2
                  }}
                >
                  {isMobile ? 'Cuarentena' : isTablet ? 'En Cuarentena' : 'En Cuarentena'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: 'var(--color-text-secondary)',
                    fontSize: isMobile ? '0.65rem' : '0.7rem',
                    lineHeight: 1.1
                  }}
                >
                  ({partidasEnCuarentenaCount})
                </Typography>
              </Box>
            </Box>
          } 
          {...a11yProps(0)} 
        />
        <Tab 
          label={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 0.5 : isTablet ? 0.75 : 1,
              flexDirection: isMobile ? 'column' : 'row',
              width: '100%',
              justifyContent: 'center'
            }}>
              <CheckCircleIcon sx={{ fontSize: isMobile ? 18 : isTablet ? 19 : 20 }} />
              <Box sx={{ 
                textAlign: isMobile ? 'center' : 'left',
                minWidth: 0,
                flex: 1
              }}>
                <Typography 
                  variant={isMobile ? "caption" : isTablet ? "body2" : "body2"} 
                  sx={{ 
                    fontWeight: 'inherit',
                    fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem',
                    lineHeight: 1.2
                  }}
                >
                  {isMobile ? 'Aprobadas' : isTablet ? 'Aprobadas' : 'Partidas Aprobadas'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: 'var(--color-text-secondary)',
                    fontSize: isMobile ? '0.65rem' : '0.7rem',
                    lineHeight: 1.1
                  }}
                >
                  ({partidasAprobadasCount})
                </Typography>
              </Box>
            </Box>
          } 
          {...a11yProps(1)} 
        />
      </Tabs>
    </Box>
  );
};

export default CalidadTabs; 