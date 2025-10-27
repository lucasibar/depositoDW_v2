import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, IconButton, Card, CardContent, Divider } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Visibility, VisibilityOff } from '@mui/icons-material';
import { usePosicionesMapa } from '../../../hooks/usePosicionesMapa';
import { useNavegacionRapidaPosiciones } from '../../../features/adicionesRapidas/hooks/useNavegacionRapidaPosiciones';
import MapaDepositoBase from '../../../components/MapaDeposito/MapaDepositoBase';
import ChequeoPosicionModal from '../../../components/MapaDeposito/ChequeoPosicionModal';

const MapDeposito = () => {
  const [showStatistics, setShowStatistics] = useState(true);
  const [modalChequeo, setModalChequeo] = useState({ open: false, posicion: null });
  
  // Obtener datos reales de la API
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

  // Hook para navegación rápida
  const { navegarAPosicionesConBusqueda } = useNavegacionRapidaPosiciones();

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
    } else {
      // Si no se encuentra la posición, navegar como antes
      const resultado = {
        posicion: {
          rack: parseInt(rack),
          fila: position,
          AB: floor
        }
      };
      navegarAPosicionesConBusqueda(resultado);
    }
  };

  const handlePasilloClick = (pasilloId) => {
    console.log('Clic en pasillo:', pasilloId);
    const numeroPasillo = pasilloId.split('-')[1];
    
    const resultado = {
      posicion: {
        numeroPasillo: parseInt(numeroPasillo)
      }
    };
    
    navegarAPosicionesConBusqueda(resultado);
  };

  const handleChequeoActualizado = () => {
    // Refrescar los datos después del chequeo
    refetch();
  };

  return (
    <>
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
        showStatistics={showStatistics}
        onToggleStatistics={() => setShowStatistics(!showStatistics)}
        colorLogic="categoria"
        title="Mapa del Depósito"
        showViewToggle={true}
        showCapacityInfo={true}
      />
      
      <ChequeoPosicionModal
        open={modalChequeo.open}
        onClose={() => setModalChequeo({ open: false, posicion: null })}
        posicion={modalChequeo.posicion}
        onChequeoActualizado={handleChequeoActualizado}
      />
    </>
  );
};

export default MapDeposito;
