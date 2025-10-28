import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MapaDepositoBase from '../../components/MapaDeposito/MapaDepositoBase';
import ChequeoPosicionModal from '../../components/MapaDeposito/ChequeoPosicionModal';
import { usePosicionesMapa } from '../../hooks/usePosicionesMapa';

const MapaChequeoPage = () => {
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const [modalChequeo, setModalChequeo] = useState({ open: false, posicion: null });
  
  // Obtener datos de la API
  const { 
    posiciones, 
    categoriasDisponibles, 
    totalPosiciones, 
    posicionesConMovimientos, 
    posicionesVacias,
    loading, 
    error, 
    refetch 
  } = usePosicionesMapa();

  // Función para manejar el clic en una posición
  const handlePositionClick = (rack, position, floor) => {
    console.log('Clic en posición:', { rack, position, floor });
    
    // Buscar la posición en los datos
    const posicionData = posiciones.find(p => 
      p.rack === parseInt(rack) && 
      p.fila === position && 
      p.AB === floor
    );
    
    if (posicionData) {
      setModalChequeo({ open: true, posicion: posicionData });
    }
  };

  const handlePasilloClick = (pasilloId) => {
    console.log('Clic en pasillo:', pasilloId);
    // Los pasillos no se pueden chequear, solo informar
  };

  const handleChequeoActualizado = () => {
    // Refrescar los datos después del chequeo
    refetch();
  };

  return (
    <AppLayout user={user} pageTitle="Mapa de Chequeo de Posiciones">
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Mapa de Chequeo de Posiciones
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
          <MapaDepositoBase
            posiciones={posiciones}
            categoriasDisponibles={categoriasDisponibles}
            totalPosiciones={totalPosiciones}
            posicionesConMovimientos={posicionesConMovimientos}
            posicionesVacias={posicionesVacias}
            loading={loading}
            error={error}
            onRefetch={refetch}
            onPositionClick={handlePositionClick}
            onPasilloClick={handlePasilloClick}
            showStatistics={false}
            onToggleStatistics={() => {}}
            colorLogic="chequeo"
            title="Mapa de Chequeo"
            showViewToggle={false}
            showCapacityInfo={false}
          />
        </Paper>
      </Box>
      
      <ChequeoPosicionModal
        open={modalChequeo.open}
        onClose={() => setModalChequeo({ open: false, posicion: null })}
        posicion={modalChequeo.posicion}
        onChequeoActualizado={handleChequeoActualizado}
      />
    </AppLayout>
  );
};

export default MapaChequeoPage;


