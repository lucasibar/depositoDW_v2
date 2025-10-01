import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MapDeposito from './components/MapDeposito';

const MapaPage = () => {
  const user = useSelector(state => state.auth.user);
  const location = useLocation();

  return (
    <AppLayout user={user} pageTitle="Mapa del Depósito">
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Mapa del Depósito
          </Typography>
          <PageNavigationMenu user={user} currentPath={location.pathname} />
        </Box>
        
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <MapDeposito />
        </Paper>
      </Box>
    </AppLayout>
  );
};

export default MapaPage;
