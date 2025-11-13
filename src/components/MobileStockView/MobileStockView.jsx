import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Fab,
  Collapse
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import StockMetricsPanel from '../StockMetricsPanel/StockMetricsPanel';
import { getPosLabel } from '../../utils/posicionUtils';

const MobileStockView = ({ 
  data, 
  loading, 
  error, 
  search, 
  setSearch, 
  selectedIndex, 
  setSelectedIndex,
  // Props para acciones de items
  onMenuOpen,
  itemMatchesSearch,
  // Props para modales
  onAbrirModalAdicionRapida
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estados para la navegación móvil
  const [currentView, setCurrentView] = useState('lista'); // 'lista' | 'detalle' | 'metricas'
  const [showMetrics, setShowMetrics] = useState(false);
  
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    
    const searchTerms = search.toLowerCase().trim().split(/\s+/);
    
    return data.filter(p => {
      const posLabel = getPosLabel(p.posicion).toLowerCase();
      
      const itemMatchesAllTerms = (item) => {
        const itemTexts = [];
        itemTexts.push(item.item?.categoria || '');
        itemTexts.push(item.item?.descripcion || '');
        itemTexts.push(item.item?.proveedor?.nombre || '');
        
        (item.partidas || []).forEach(partida => {
          itemTexts.push(partida.numeroPartida || '');
        });
        
        const combinedItemText = itemTexts.join(' ').toLowerCase();
        
        return searchTerms.every(term => {
          if (term.includes('-')) {
            const parts = term.split('-');
            if (parts.length === 2) {
              const rack = parseInt(parts[0]);
              const fila = parseInt(parts[1]);
              if (!isNaN(rack) && !isNaN(fila)) {
                return p.posicion?.rack === rack && p.posicion?.fila === fila;
              }
            }
            return posLabel.includes(term);
          }
          
          if (term === 'pasillo') {
            return posLabel.includes('pasillo');
          }
          
          if (term.startsWith('pasillo')) {
            const parts = term.split(' ');
            if (parts.length === 2) {
              const pasilloNum = parseInt(parts[1]);
              if (!isNaN(pasilloNum)) {
                return p.posicion?.numeroPasillo === pasilloNum;
              }
            }
            return posLabel.includes(term);
          }
          
          return combinedItemText.includes(term);
        });
      };
      
      const positionMatches = searchTerms.every(term => {
        if (term.includes('-')) {
          const parts = term.split('-');
          if (parts.length === 2) {
            const rack = parseInt(parts[0]);
            const fila = parseInt(parts[1]);
            if (!isNaN(rack) && !isNaN(fila)) {
              return p.posicion?.rack === rack && p.posicion?.fila === fila;
            }
          }
          return posLabel.includes(term);
        }
        
        if (term === 'pasillo') {
          return posLabel.includes('pasillo');
        }
        
        if (term.startsWith('pasillo')) {
          const parts = term.split(' ');
          if (parts.length === 2) {
            const pasilloNum = parseInt(parts[1]);
            if (!isNaN(pasilloNum)) {
              return p.posicion?.numeroPasillo === pasilloNum;
            }
          }
          return posLabel.includes(term);
        }
        
        return posLabel.includes(term);
      });
      
      if (positionMatches) {
        return true;
      }
      
      return (p.items || []).some(item => itemMatchesAllTerms(item));
    });
  }, [data, search]);

  const selected = filteredData[selectedIndex] || null;

  // Handlers para navegación
  const handlePosicionClick = (index) => {
    setSelectedIndex(index);
    setCurrentView('detalle');
  };

  const handleBackToList = () => {
    setCurrentView('lista');
  };

  const handleToggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  // Renderizar barra de búsqueda
  const renderSearchBar = () => (
    <Box sx={{ 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      px: 2
    }}>
      <SearchIcon sx={{ 
        position: 'absolute', 
        left: 20, 
        color: 'text.secondary',
        fontSize: 20,
        zIndex: 1
      }} />
      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
        placeholder="Buscar posiciones o items..."
        style={{ 
          padding: '12px 12px 12px 44px', 
          borderRadius: 25, 
          border: '1px solid var(--color-border)',
          fontSize: '16px',
          outline: 'none',
          backgroundColor: 'transparent',
          width: '100%'
        }}
      />
    </Box>
  );

  // Renderizar lista de posiciones
  const renderPosicionesList = () => (
    <Box sx={{ 
      height: 'calc(100vh - 200px)',
      overflow: 'auto',
      px: 2
    }}>
      {loading && <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando...</Typography>}
      {error && <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>}
      
      {!loading && filteredData.map((p, idx) => (
        <Box
          key={p.posicion?.id || idx}
          onClick={() => handlePosicionClick(idx)}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'var(--color-divider)',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {getPosLabel(p.posicion)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(p.items?.length || 0)} items
          </Typography>
        </Box>
      ))}
    </Box>
  );

  // Renderizar detalle de posición
  const renderPosicionDetail = () => (
    <Box sx={{ 
      height: 'calc(100vh - 200px)',
      overflow: 'auto',
      px: 2
    }}>
      {selected && (
        <>
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {getPosLabel(selected.posicion)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(selected.items?.length || 0)} items en esta posición
              </Typography>
            </Box>
            
            <IconButton
              onClick={() => onAbrirModalAdicionRapida(selected.posicion)}
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
              title="Adición Rápida"
            >
              <AddIcon />
            </IconButton>
          </Box>
          
          {(selected.items || []).map((item, itemIdx) => (
            <Box 
              key={`${item.item?.id || itemIdx}`} 
              sx={{ 
                mb: 2,
                p: 2,
                border: itemMatchesSearch(item) ? '2px solid #4CAF50' : '1px solid var(--color-border)',
                borderRadius: 1,
                backgroundColor: itemMatchesSearch(item) ? '#E8F5E8' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.item?.categoria || 'Sin categoría'} - {item.item?.descripcion || 'Sin descripción'} - {item.item?.proveedor?.nombre || 'Sin proveedor'}
                </Typography>
              </Box>
              
              {(item.partidas || []).map((partida, partidaIdx) => (
                <Box 
                  key={`${partida.id}-${partida.numeroPartida}`}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 0.5
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Partida: {partida.numeroPartida} - <span style={{ color: '#1976D2', fontWeight: 600 }}>{partida.kilos} kg</span> - <span style={{ color: '#7B1FA2', fontWeight: 600 }}>{partida.unidades} un</span>
                  </Typography>
                  
                  <IconButton
                    onClick={(e) => onMenuOpen(e, item.item, partida, selected.posicion)}
                    size="small"
                    sx={{
                      ml: 2,
                      '&:hover': {
                        backgroundColor: 'var(--color-primary-light)'
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ))}
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-background)'
    }}>
      {/* Header con título y controles */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {currentView === 'detalle' && (
              <IconButton
                onClick={handleBackToList}
                sx={{
                  color: 'var(--color-text-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--color-divider)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentView === 'detalle' ? getPosLabel(selected?.posicion) : 'Stock por Posición'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Botón mini para métricas */}
            <IconButton
              onClick={handleToggleMetrics}
              sx={{
                color: showMetrics ? 'var(--color-primary)' : 'text.secondary',
                backgroundColor: showMetrics ? 'var(--color-primary-light)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-light)'
                }
              }}
              title="Ver métricas"
            >
              <AnalyticsIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Barra de búsqueda */}
        {renderSearchBar()}
      </Box>

      {/* Panel de métricas colapsable */}
      <Collapse in={showMetrics}>
        <Box sx={{ 
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)'
        }}>
          <StockMetricsPanel 
            data={filteredData}
            searchTerm={search}
            selectedPosition={selected?.posicion}
          />
        </Box>
      </Collapse>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Slide direction="left" in={currentView === 'lista'} mountOnEnter unmountOnExit>
          <Box sx={{ height: '100%' }}>
            {renderPosicionesList()}
          </Box>
        </Slide>
        
        <Slide direction="right" in={currentView === 'detalle'} mountOnEnter unmountOnExit>
          <Box sx={{ height: '100%' }}>
            {renderPosicionDetail()}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default MobileStockView;
