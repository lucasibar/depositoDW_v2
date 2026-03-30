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
  FilterAlt as FilterIcon,
  Add as AddIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { authService } from '../../services/auth/authService';
import { dashboardSalidasService } from '../../services/dashboardSalidasService';
import { DashboardSalidasCard } from '../../components/DashboardSalidasCard';
import { SalidasBreakdownTable } from '../../components/SalidasBreakdownTable/SalidasBreakdownTable';
import { ConfiguracionComboModal } from '../../components/ConfiguracionComboModal/ConfiguracionComboModal';

const DashboardSalidasPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Filtros
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [clienteId, setClienteId] = useState('');

  // Modals
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    
    // Set default dates (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setFechaDesde(firstDay.toISOString().split('T')[0]);
    setFechaHasta(now.toISOString().split('T')[0]);

    cargarClientes();
  }, []);

  useEffect(() => {
    if (fechaDesde && fechaHasta) {
      cargarDatos();
    }
  }, [fechaDesde, fechaHasta, clienteId]);

  const cargarClientes = async () => {
    try {
      const data = await dashboardSalidasService.obtenerClientes();
      setClientes(data);
    } catch (err) {
      console.error('Error cargando clientes:', err);
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [dash, detail] = await Promise.all([
        dashboardSalidasService.obtenerDashboard(fechaDesde, fechaHasta, clienteId),
        dashboardSalidasService.obtenerDesglose(fechaDesde, fechaHasta, clienteId)
      ]);
      setDashboardData(dash);
      setBreakdownData(detail);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
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
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Dashboard de Salidas">
      <Box sx={{ p: 3 }}>
        {/* Header and Filters */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Dashboard de Salidas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reporte de consumo de materiales por combos y clientes
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Desde"
              type="date"
              size="small"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Cliente"
              size="small"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos los clientes</MenuItem>
              {clientes.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
              ))}
            </TextField>
            <Tooltip title="Actualizar">
              <IconButton onClick={cargarDatos} disabled={loading} color="primary" sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
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
                <DashboardSalidasCard 
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
                <Typography color="text.secondary">No hay combos configurados. Crea uno nuevo para empezar.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Detailed Breakdown Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon sx={{ color: 'primary.main' }} />
            Desglose de Movimientos
          </Typography>
          <SalidasBreakdownTable dataset={breakdownData} loading={loading} />
        </Box>
      </Box>

      <ConfiguracionComboModal 
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        combo={selectedCombo}
        onConfigSaved={handleConfigSaved}
      />
    </AppLayout>
  );
};

export default DashboardSalidasPage;
