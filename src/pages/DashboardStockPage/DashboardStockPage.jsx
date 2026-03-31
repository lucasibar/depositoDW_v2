import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  MenuItem,
  Button,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Add as AddIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { authService } from '../../services/auth/authService';
import { dashboardStockService } from '../../services/dashboardStockService';
import { DashboardStockCard } from '../../components/DashboardStockCard/DashboardStockCard';
import { StockBreakdownTable } from '../../components/StockBreakdownTable/StockBreakdownTable';
import { ConfiguracionStockComboModal } from '../../components/ConfiguracionStockComboModal/ConfiguracionStockComboModal';

const DashboardStockPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  // Filtros
  const [proveedorId, setProveedorId] = useState('');

  // Modals
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    cargarProveedores();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [proveedorId]);

  const cargarProveedores = async () => {
    try {
      const data = await dashboardStockService.obtenerProveedores();
      setProveedores(data);
    } catch (err) {
      console.error('Error cargando proveedores:', err);
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [dash, detail] = await Promise.all([
        dashboardStockService.obtenerDashboard(proveedorId),
        dashboardStockService.obtenerDesglose(proveedorId)
      ]);
      setDashboardData(dash);
      setBreakdownData(detail);
    } catch (err) {
      console.error('Error cargando datos del dashboard de stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigClick = (combo) => {
    setSelectedCombo(combo);
    setConfigModalOpen(true);
  };

  const handleCreateCombo = () => {
    setSelectedCombo({ nombreCombo: '', itemIds: [], color: '#3f51b5' });
    setConfigModalOpen(true);
  };

  const handleConfigSaved = () => {
    cargarDatos();
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  return (
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Dashboard de Stock">
      <Box sx={{ p: 3 }}>
        {/* Header and Filters */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Dashboard de Stock
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualización de mercadería disponible por combos y dueños
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              select
              label="Proveedor (Dueño)"
              size="small"
              value={proveedorId}
              onChange={(e) => setProveedorId(e.target.value)}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="">Todos los proveedores</MenuItem>
              {proveedores.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </TextField>
            <Tooltip title="Actualizar">
              <IconButton onClick={cargarDatos} disabled={loading} color="primary" sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', '&:hover': { bgcolor: '#f5f5f5' } }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleCreateCombo}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Nuevo Combo
            </Button>
          </Box>
        </Box>

        {/* Dashboard Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {loading && dashboardData.length === 0 ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            dashboardData.map((combo) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={combo.id}>
                <DashboardStockCard 
                  tarjeta={combo} 
                  onConfigClick={() => handleConfigClick(combo)}
                  isLoading={loading}
                />
              </Grid>
            ))
          )}
          {!loading && dashboardData.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0', bgcolor: 'transparent' }}>
                <Typography color="text.secondary">No hay combos configurados para stock. Crea uno nuevo para empezar.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Detailed Breakdown Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon sx={{ color: 'primary.main' }} />
            Desglose de Stock Actual
          </Typography>
          <StockBreakdownTable dataset={breakdownData} loading={loading} />
        </Box>
      </Box>

      <ConfiguracionStockComboModal 
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        combo={selectedCombo}
        onConfigSaved={handleConfigSaved}
      />
    </AppLayout>
  );
};

export default DashboardStockPage;
