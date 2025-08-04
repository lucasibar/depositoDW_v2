import React from 'react';
import { Tabs, Tab, Badge } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';

const SalidaTabs = ({
  tabValue,
  onTabChange,
  salidasPendientesCount = 0,
  salidasAprobadasCount = 0,
  remitosCount = 0
}) => {
  const handleChange = (event, newValue) => {
    onTabChange(event, newValue);
  };

  return (
    <Tabs
      value={tabValue}
      onChange={handleChange}
      aria-label="salida tabs"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTab-root': {
          minHeight: 48,
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500
        }
      }}
    >
      <Tab
        label={
          <Badge badgeContent={remitosCount} color="success">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ReceiptIcon fontSize="small" />
              Remito Salida
            </span>
          </Badge>
        }
        id="salida-tab-0"
        aria-controls="salida-tabpanel-0"
      />
      <Tab
        label={
          <Badge badgeContent={salidasPendientesCount} color="warning">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExitToAppIcon fontSize="small" />
              Salidas Pendientes
            </span>
          </Badge>
        }
        id="salida-tab-1"
        aria-controls="salida-tabpanel-1"
      />
      <Tab
        label={
          <Badge badgeContent={salidasAprobadasCount} color="info">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HistoryIcon fontSize="small" />
              Historial
            </span>
          </Badge>
        }
        id="salida-tab-2"
        aria-controls="salida-tabpanel-2"
      />
    </Tabs>
  );
};

export default SalidaTabs; 