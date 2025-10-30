import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { ListaMateriales } from '../../components/ReporteConsumo/ListaMateriales';
import { GraficoConsumo } from '../../components/ReporteConsumo/GraficoConsumo';
import { reporteConsumoService } from '../../services/reporteConsumoService';
import { authService } from '../../services/authService';
import './ReporteConsumoPage.css';

/**
 * Página principal del reporte de consumo
 */
export const ReporteConsumoPage = () => {
  const [user, setUser] = useState(null);

  // Estados para fechas
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Estados para materiales
  const [materiales, setMateriales] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);

  // Estados para datos del gráfico
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [unificar, setUnificar] = useState(false);

  // Estados de carga
  const [loadingMateriales, setLoadingMateriales] = useState(false);
  const [loadingGrafico, setLoadingGrafico] = useState(false);
  const [error, setError] = useState(null);

  // Efecto para obtener el usuario
  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  // Efecto para establecer fechas por defecto (último mes)
  useEffect(() => {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    setFechaHasta(hoy.toISOString().split('T')[0]);
    setFechaDesde(haceUnMes.toISOString().split('T')[0]);
  }, []);

  // Función para buscar datos cuando cambian las fechas
  const buscarDatos = async () => {
    if (!fechaDesde || !fechaHasta) return;

    try {
      setError(null);
      setLoadingMateriales(true);

      // Obtener materiales únicos del período
      const materialesData = await reporteConsumoService.obtenerMaterialesUnicos(fechaDesde, fechaHasta);
      setMateriales(materialesData);
      setMaterialesSeleccionados([]);
      setDatosGrafico([]);

    } catch (err) {
      setError(err.message);
      console.error('Error al buscar datos:', err);
    } finally {
      setLoadingMateriales(false);
    }
  };

  // Función para actualizar el gráfico cuando cambian los materiales seleccionados
  const actualizarGrafico = async () => {
    if (!fechaDesde || !fechaHasta || materialesSeleccionados.length === 0) {
      setDatosGrafico([]);
      return;
    }

    try {
      setLoadingGrafico(true);
      setError(null);

      const datos = await reporteConsumoService.obtenerDatosConsumo(
        fechaDesde, 
        fechaHasta, 
        materialesSeleccionados, 
        unificar
      );
      
      setDatosGrafico(datos);

    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar gráfico:', err);
    } finally {
      setLoadingGrafico(false);
    }
  };

  // Efecto para actualizar el gráfico cuando cambian los materiales seleccionados o la opción de unificar
  useEffect(() => {
    actualizarGrafico();
  }, [materialesSeleccionados, unificar]);

  // Handlers para el selector de fechas
  const handleFechaDesdeChange = (fecha) => {
    setFechaDesde(fecha);
  };

  const handleFechaHastaChange = (fecha) => {
    setFechaHasta(fecha);
  };

  // Handlers para la lista de materiales
  const handleMaterialToggle = (materialId) => {
    setMaterialesSeleccionados(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };

  const handleSeleccionarTodos = () => {
    setMaterialesSeleccionados(materiales.map(m => m.id));
  };

  const handleDeseleccionarTodos = () => {
    setMaterialesSeleccionados([]);
  };

  // Handler para el checkbox de unificar
  const handleUnificarChange = (e) => {
    setUnificar(e.target.checked);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      pageTitle="Reporte de Consumo"
    >
      <Box sx={{ p: 3 }}>
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error" variant="body2">
              <strong>Error:</strong> {error}
            </Typography>
          </Box>
        )}



        {/* Contenido principal */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '350px 1fr' }, 
          gap: 3,
          alignItems: 'start'
        }}>
          {/* Lista de materiales */}
          <Box sx={{ position: { lg: 'sticky' }, top: 20 }}>
            <ListaMateriales
              materiales={materiales}
              materialesSeleccionados={materialesSeleccionados}
              onMaterialToggle={handleMaterialToggle}
              onSeleccionarTodos={handleSeleccionarTodos}
              onDeseleccionarTodos={handleDeseleccionarTodos}
              loading={loadingMateriales}
              unificar={unificar}
              onUnificarChange={handleUnificarChange}
              fechaDesde={fechaDesde}
              fechaHasta={fechaHasta}
              onFechaDesdeChange={handleFechaDesdeChange}
              onFechaHastaChange={handleFechaHastaChange}
              onBuscar={buscarDatos}
            />
          </Box>

          {/* Gráfico */}
          <Box sx={{ minHeight: 500 }}>
            <GraficoConsumo
              datos={datosGrafico}
              materialesSeleccionados={materialesSeleccionados}
              materiales={materiales}
              unificar={unificar}
              loading={loadingGrafico}
            />
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
};
