import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, IconButton, Card, CardContent, Divider } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Visibility, VisibilityOff } from '@mui/icons-material';

const MapaDepositoBase = ({
  posiciones = [],
  categoriasDisponibles = [],
  totalPosiciones = 0,
  posicionesConMovimientos = 0,
  posicionesVacias = 0,
  loading = false,
  error = null,
  onRefetch = () => {},
  onPositionClick = () => {},
  onPasilloClick = () => {},
  showStatistics = true,
  onToggleStatistics = () => {},
  colorLogic = 'categoria', // 'categoria' o 'chequeo'
  title = "Mapa del Depósito",
  showViewToggle = true,
  showCapacityInfo = true,
  customLegend = null
}) => {
  const [currentView, setCurrentView] = useState(0); // 0: Real, 1: Ideal

  // Generar colores únicos para cada categoría
  const coloresPorCategoria = React.useMemo(() => {
    const colores = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
      '#00FFFF', '#FF8000', '#8000FF', '#008000', '#000080',
      '#800000', '#808000', '#008080', '#800080', '#FFC0CB',
      '#A52A2A', '#FFD700', '#C0C0C0', '#808080', '#000000'
    ];
    
    const mapaColores = {};
    categoriasDisponibles.forEach((categoria, index) => {
      mapaColores[categoria] = colores[index % colores.length];
    });
    
    return mapaColores;
  }, [categoriasDisponibles]);

  // Convertir datos de la API a formato de categorías reales por rack, fila y AB
  const categoriasReales = React.useMemo(() => {
    const categorias = {};
    
    posiciones.forEach(posicion => {
      const positionKey = `rack-${posicion.rack}-fila-${posicion.fila}-${posicion.AB}`;
      categorias[positionKey] = posicion.categoria;
    });
    
    return categorias;
  }, [posiciones]);

  // Obtener categorías ideales desde la API por rack, fila y AB
  const categoriasIdeales = React.useMemo(() => {
    const categorias = {};
    
    posiciones.forEach(posicion => {
      if (posicion.categoria_ideal) {
        const positionKey = `rack-${posicion.rack}-fila-${posicion.fila}-${posicion.AB}`;
        categorias[positionKey] = posicion.categoria_ideal;
      }
    });
    
    return categorias;
  }, [posiciones]);

  // Lógica de colores según fecha de chequeo
  const getCheckColor = (ultimoChequeo) => {
    if (!ultimoChequeo) return '#FF0000'; // Rojo si nunca se chequeó
    
    const ahora = new Date();
    const fechaChequeo = new Date(ultimoChequeo);
    const diasDiferencia = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));
    
    if (diasDiferencia <= 7) return '#00FF00'; // Verde si fue hace una semana o menos
    if (diasDiferencia <= 30) return '#FFFF00'; // Amarillo si fue hace más de una semana pero menos de un mes
    return '#FF0000'; // Rojo si fue hace más de un mes
  };

  // Pesos por pallet por categoría (en kilos)
  const pesosPorCategoria = {
    'algodon': 648,
    'algodon-color': 575,
    'nylon': 475,
    'nylon-color': 475,
    'goma': 300,
    'lycra': 735,
    'lycra REC': 630,
    'nylon REC': 660,
    'poliester': 425
  };

  // Calcular capacidad total del depósito en vista ideal
  const capacidadDeposito = React.useMemo(() => {
    const capacidadPorCategoria = {};
    let totalKilos = 0;

    // Contar posiciones por categoría ideal
    posiciones.forEach(posicion => {
      if (posicion.categoria_ideal) {
        const categoria = posicion.categoria_ideal;
        if (!capacidadPorCategoria[categoria]) {
          capacidadPorCategoria[categoria] = 0;
        }
        capacidadPorCategoria[categoria] += 1;
      }
    });

    // Calcular kilos totales por categoría
    const kilosPorCategoria = {};
    Object.keys(capacidadPorCategoria).forEach(categoria => {
      const pesoPorPallet = pesosPorCategoria[categoria] || 0;
      const kilos = capacidadPorCategoria[categoria] * pesoPorPallet;
      kilosPorCategoria[categoria] = kilos;
      totalKilos += kilos;
    });

    return {
      capacidadPorCategoria,
      kilosPorCategoria,
      totalKilos,
      totalPosiciones: Object.values(capacidadPorCategoria).reduce((sum, count) => sum + count, 0)
    };
  }, [posiciones]);

  // Generar la estructura del depósito: P1 → R1 → R2 → P2 → R3 → R4 → ... → P10 → R19 → R20 → P11
  const generateDepositoStructure = () => {
    const structure = [];
    
    // Generar la estructura completa de izquierda a derecha (P1 a P11)
    for (let i = 1; i <= 11; i++) {
      if (i === 1) {
        // Pasillo 1 (empieza aquí)
        structure.push({
          type: 'pasillo',
          id: `pasillo-${i}`,
          label: `P${i}`,
          width: 1
        });
        // Rack 1 y 2
        structure.push({
          type: 'rack',
          id: 'rack-1',
          label: 'R1',
          width: 1,
          positions: 14
        });
        structure.push({
          type: 'rack',
          id: 'rack-2',
          label: 'R2',
          width: 1,
          positions: 14
        });
      } else if (i === 11) {
        // Pasillo 11 (termina aquí, sin racks)
        structure.push({
          type: 'pasillo',
          id: `pasillo-${i}`,
          label: `P${i}`,
          width: 1
        });
      } else {
        // Pasillo intermedio
        structure.push({
          type: 'pasillo',
          id: `pasillo-${i}`,
          label: `P${i}`,
          width: 1
        });
        // Dos racks por pasillo
        const rackNum1 = (i - 1) * 2 + 1;
        const rackNum2 = (i - 1) * 2 + 2;
        structure.push({
          type: 'rack',
          id: `rack-${rackNum1}`,
          label: `R${rackNum1}`,
          width: 1,
          positions: 14
        });
        structure.push({
          type: 'rack',
          id: `rack-${rackNum2}`,
          label: `R${rackNum2}`,
          width: 1,
          positions: 14
        });
      }
    }
    
    // Invertir el array para mostrar de derecha a izquierda en pantalla
    return structure.reverse();
  };

  const depositoStructure = generateDepositoStructure();

  const RackComponent = ({ rack, floor }) => {
    const positions = Array.from({ length: rack.positions }, (_, i) => rack.positions - i);
    
    // Función para determinar el color de la posición basado en rack, fila y AB
    const getPositionColor = (position) => {
      const positionKey = `rack-${rack.id.split('-')[1]}-fila-${position}-${floor}`;
      
      if (colorLogic === 'chequeo') {
        // Buscar la posición en los datos para obtener el último chequeo
        const posicionData = posiciones.find(p => 
          p.rack === parseInt(rack.id.split('-')[1]) && 
          p.fila === position && 
          p.AB === floor
        );
        
        if (posicionData) {
          return getCheckColor(posicionData.ultimo_chequeo);
        }
        return '#FF0000'; // Rojo por defecto si no se encuentra
      }
      
      if (currentView === 1) { // Vista ideal
        const categoriaIdeal = categoriasIdeales[positionKey];
        return categoriaIdeal ? coloresPorCategoria[categoriaIdeal] : 'var(--color-divider)';
      }
      
      // Vista real
      const categoriaReal = categoriasReales[positionKey];
      
      if (!categoriaReal) {
        return 'var(--color-warning-light)'; // Amarillo para vacío
      }
      
      return coloresPorCategoria[categoriaReal] || 'var(--color-divider)';
    };

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: 'var(--color-background)',
          p: 0.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minHeight: 400,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Etiqueta del rack */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'var(--color-primary)',
            mb: 0.5,
            fontSize: '0.7rem',
            backgroundColor: 'var(--color-surface)',
            px: 1,
            py: 0.25,
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--color-primary)'
          }}
        >
          {rack.label}
        </Typography>
        
        {/* Posiciones del rack como columna vertical */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            width: '100%',
            flex: 1,
            alignItems: 'center'
          }}
        >
          {positions.map((position) => (
            <Box
              key={position}
              onClick={() => onPositionClick(rack.id.split('-')[1], position, floor)}
              sx={{
                width: '90%',
                height: 20,
                backgroundColor: getPositionColor(position),
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-light)',
                  border: '2px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              {position}
            </Box>
          ))}
        </Box>
        
        {/* Siglas RCS para racks 15, 16 y 17 */}
        {(rack.id === 'rack-15' || rack.id === 'rack-16' || rack.id === 'rack-17') && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'var(--color-primary)',
              fontSize: '0.6rem',
              backgroundColor: 'var(--color-primary-light)',
              px: 1,
              py: 0.25,
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--color-primary)',
              mt: 0.5,
              textAlign: 'center'
            }}
          >
            RCS
          </Typography>
        )}
      </Box>
    );
  };

  const PasilloComponent = ({ pasillo }) => (
    <Box
      onClick={() => onPasilloClick(pasillo.id)}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-divider)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'var(--color-primary-light)',
          border: '2px solid var(--color-primary)',
          transform: 'scale(1.02)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 2,
          height: '100%',
          backgroundColor: 'var(--color-primary)',
          opacity: 0.3
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            fontSize: '0.7rem',
            backgroundColor: 'var(--color-surface)',
            px: 1,
            py: 0.25,
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--color-border)',
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap'
          }}
        >
          {pasillo.label}
        </Typography>
        {pasillo.id === 'pasillo-4' && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
              fontSize: '0.6rem',
              backgroundColor: 'var(--color-primary-light)',
              px: 1,
              py: 0.25,
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--color-primary)',
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}
          >
            Sector de Picking
          </Typography>
        )}
      </Box>
    </Box>
  );

  const FloorComponent = ({ floor, label }) => (
    <Box sx={{ mb: 4 }}>
      {/* Título del piso */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          py: 1,
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        PISO {label}
      </Typography>
      
      {/* Estructura del piso - Layout horizontal para mostrar columnas */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 1,
          overflowX: 'auto',
          pb: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            height: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--color-divider)',
            borderRadius: 4
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--color-primary)',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)'
            }
          }
        }}
      >
        {depositoStructure.map((item, index) => (
          <Box
            key={`${floor}-${item.id}-${index}`}
            sx={{
              minWidth: item.type === 'rack' ? 70 : 50,
              maxWidth: item.type === 'rack' ? 70 : 50,
              height: 420,
              flexShrink: 0
            }}
          >
            {item.type === 'rack' ? (
              <RackComponent rack={item} floor={floor} />
            ) : (
              <PasilloComponent pasillo={item} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Calcular estadísticas
  const calculateStatistics = () => {
    const totalPositions = posiciones.length;
    let correctPositions = 0;
    let emptyPositions = 0;
    let incorrectPositions = 0;

    // Calcular posiciones correctas e incorrectas
    posiciones.forEach(posicion => {
      const positionKey = `rack-${posicion.rack}-fila-${posicion.fila}-${posicion.AB}`;
      const categoriaIdeal = categoriasIdeales[positionKey];
      const categoriaReal = posicion.categoria;
      
      if (posicion.tieneMovimientos) {
        if (categoriaReal && categoriaIdeal && categoriaReal.toLowerCase() === categoriaIdeal.toLowerCase()) {
          correctPositions += 1;
        } else {
          incorrectPositions += 1;
        }
      } else {
        emptyPositions += 1;
      }
    });

    return {
      total: totalPositions,
      correct: correctPositions,
      empty: emptyPositions,
      incorrect: incorrectPositions,
      correctPercentage: totalPositions > 0 ? Math.round((correctPositions / totalPositions) * 100) : 0,
      emptyPercentage: totalPositions > 0 ? Math.round((emptyPositions / totalPositions) * 100) : 0,
      incorrectPercentage: totalPositions > 0 ? Math.round((incorrectPositions / totalPositions) * 100) : 0
    };
  };

  const stats = calculateStatistics();

  // Mostrar loading o error
  if (loading) {
    return (
      <Box sx={{ width: '100%', px: 2, textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)' }}>
          Cargando mapa del depósito...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', px: 2, textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: 'var(--color-error)', mb: 2 }}>
          Error al cargar el mapa
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
          {error}
        </Typography>
        <IconButton onClick={onRefetch} sx={{ color: 'var(--color-primary)' }}>
          <Typography variant="body2">Reintentar</Typography>
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      {/* Carrusel de vistas */}
      {showViewToggle && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => setCurrentView(0)}
              sx={{
                backgroundColor: currentView === 0 ? 'var(--color-primary)' : 'transparent',
                color: currentView === 0 ? 'white' : 'var(--color-text-secondary)',
                '&:hover': {
                  backgroundColor: currentView === 0 ? 'var(--color-primary-dark)' : 'var(--color-divider)'
                }
              }}
            >
              <ArrowBackIos />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
              {currentView === 0 ? 'Vista Real' : 'Vista Ideal'}
            </Typography>
            
            <IconButton
              onClick={() => setCurrentView(1)}
              sx={{
                backgroundColor: currentView === 1 ? 'var(--color-primary)' : 'transparent',
                color: currentView === 1 ? 'white' : 'var(--color-text-secondary)',
                '&:hover': {
                  backgroundColor: currentView === 1 ? 'var(--color-primary-dark)' : 'var(--color-divider)'
                }
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
          
          {/* Indicador de vista */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: currentView === 0 ? 'var(--color-primary)' : 'var(--color-divider)'
              }}
            />
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: currentView === 1 ? 'var(--color-primary)' : 'var(--color-divider)'
              }}
            />
          </Box>
        </Box>
      )}

      {/* Piso A */}
      <FloorComponent floor="A" label="A" />
      
      {/* Separador */}
      <Box
        sx={{
          height: 2,
          backgroundColor: 'var(--color-primary)',
          borderRadius: 1,
          mb: 3,
          mx: 2
        }}
      />
      
      {/* Piso B */}
      <FloorComponent floor="B" label="B" />
      
      {/* Panel de estadísticas */}
      {showStatistics && (
        <Box sx={{ mt: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton
              onClick={onToggleStatistics}
              size="small"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              <VisibilityOff />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Estadísticas de Posiciones
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, height: 200 }}>
            {/* Panel izquierdo - Porcentajes */}
            <Card sx={{ flex: 1, height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Porcentajes de Cumplimiento
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'var(--color-success-light)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-success)'
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Posiciones Correctas
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      {stats.correctPercentage}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'var(--color-warning-light)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-warning)'
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Posiciones Vacías
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-warning)' }}>
                      {stats.emptyPercentage}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'var(--color-error-light)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-error)'
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Posiciones Incorrectas
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-error)' }}>
                      {stats.incorrectPercentage}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Divider orientation="vertical" flexItem />
            
            {/* Panel derecho - Detalles */}
            <Card sx={{ flex: 1, height: '100%' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Detalles por Categoría
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Total de Posiciones:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {stats.total}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Posiciones con Datos:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {posicionesConMovimientos}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Categorías Disponibles:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {categoriasDisponibles.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Correctas:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-success)' }}>
                      {stats.correct}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Vacías:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-warning)' }}>
                      {stats.empty}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Incorrectas:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--color-error)' }}>
                      {stats.incorrect}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
      
      {/* Capacidad del Depósito - Solo en vista ideal */}
      {currentView === 1 && showCapacityInfo && (
        <Box sx={{ mt: 4, mb: 3 }}>
          <Card sx={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center', color: 'var(--color-text-primary)' }}>
                Capacidad del Depósito - Vista Ideal
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                {Object.entries(capacidadDeposito.kilosPorCategoria).map(([categoria, kilos]) => (
                  <Box
                    key={categoria}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      backgroundColor: 'var(--color-background)',
                      borderRadius: 'var(--border-radius-md)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: coloresPorCategoria[categoria] || 'var(--color-divider)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 0.5 }}>
                        {categoria}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {kilos.toLocaleString()} kg
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                        {capacidadDeposito.capacidadPorCategoria[categoria]} posiciones
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {/* Total general */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: 'var(--color-primary-light)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-primary)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Capacidad Total del Depósito
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  {capacidadDeposito.totalKilos.toLocaleString()} kg
                </Typography>
              </Box>
              
              {/* Nota sobre pesos de referencia */}
              <Typography variant="caption" sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 2, 
                color: 'var(--color-text-secondary)', 
                opacity: 0.6,
                fontStyle: 'italic'
              }}>
                * Pesos aproximados por pallet según categoría de material
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      
      {/* Botón para mostrar/ocultar estadísticas */}
      {!showStatistics && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
            onClick={onToggleStatistics}
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'var(--color-primary-dark)'
              }
            }}
          >
            <Visibility />
          </IconButton>
        </Box>
      )}
      
      {/* Leyenda personalizada o por defecto */}
      {customLegend || (
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {colorLogic === 'chequeo' ? 'Leyenda de Estado de Chequeo:' : 'Leyenda de Categorías:'}
          </Typography>
          
          {colorLogic === 'chequeo' ? (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#00FF00',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Chequeado hace menos de 1 semana</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#FFFF00',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Chequeado hace más de 1 semana</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#FF0000',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Chequeado hace más de 1 mes o nunca</Typography>
              </Box>
            </Box>
          ) : (
            <>
              {/* Leyenda básica */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: 'var(--color-background)',
                      border: '2px solid var(--color-primary)',
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      R
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Rack</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: 'var(--color-divider)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.5rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      P
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Pasillo</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: 'var(--color-warning-light)',
                      border: '1px solid var(--color-warning)',
                      borderRadius: 'var(--border-radius-sm)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Posición Vacía</Typography>
                </Box>
              </Box>

              {/* Leyenda de colores por categoría */}
              {categoriasDisponibles.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Colores por Categoría:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    {categoriasDisponibles.map((categoria, index) => (
                      <Box key={categoria} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: coloresPorCategoria[categoria],
                            border: '1px solid rgba(0,0,0,0.2)',
                            borderRadius: 'var(--border-radius-sm)'
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                          {categoria}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
          
          <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            * Estructura: P1 → R1 → R2 → P2 → R3 → R4 → ... → P10 → R19 → R20 → P11. Cada rack contiene 14 posiciones numeradas del 1 al 14.
          </Typography>
          
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'var(--color-primary)', fontWeight: 600 }}>
            💡 Haz clic en cualquier posición o pasillo para ver los detalles
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapaDepositoBase;

