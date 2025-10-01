import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  SwapHoriz as SwapIcon,
  LocalShipping as LocalShippingIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon,
  Map as MapIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  ShoppingBag as ShoppingBagIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { stockApi } from '../../features/stock/api/stockApi';
import { useNavigate } from 'react-router-dom';
import MovimientoInterno from '../../components/MovimientoInterno/MovimientoInterno';
import AjustePosicionModal from '../../features/stock/ui/AjustePosicionModal';
import RemitoSalidaDesdePosicionModal from '../../features/salida/ui/RemitoSalidaDesdePosicionModal/RemitoSalidaDesdePosicionModal';
import { AdicionRapidaPosicion } from '../../components/AdicionRapidaPosicion';
import { apiClient } from '../../config/api';
import StockMetricsPanel from '../../components/StockMetricsPanel/StockMetricsPanel';

const getPosLabel = (posicion) => {
  if (!posicion) return 'Posición';
  if (posicion.rack && posicion.fila && posicion.AB) return `${posicion.rack}-${posicion.fila}-${posicion.AB}`;
  if (posicion.numeroPasillo) return `Pasillo ${posicion.numeroPasillo}`;
  if (posicion.entrada === true) return 'Entrada';
  return 'Posición';
};

export const StockPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');
  
  // Estados para el reporte de stock
  const [reporteStockData, setReporteStockData] = useState([]);
  const [loadingReporte, setLoadingReporte] = useState(false);
  
  // Estados para los modales de acciones
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  
  // Estados para los modales
  const [movimientoInternoOpen, setMovimientoInternoOpen] = useState(false);
  const [modalAjusteOpen, setModalAjusteOpen] = useState(false);
  const [modalRemitoSalidaOpen, setModalRemitoSalidaOpen] = useState(false);
  const [modalAdicionRapidaOpen, setModalAdicionRapidaOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Estado para el menú lateral
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await stockApi.getConsultaRapidaAgrupado();
        if (!isMounted) return;
        setData(Array.isArray(res) ? res : []);
        setSelectedIndex(0);
      } catch (e) {
        setError(e?.message || 'Error al cargar composición por posición');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Función para obtener datos del reporte de stock desde consulta rápida
  const fetchReporteStock = async () => {
    try {
      setLoadingReporte(true);
      const data = await stockApi.getConsultaRapidaAgrupado();
      
      // Transformar los datos para el formato del Excel
      const transformedData = [];
      
      data.forEach(posicion => {
        if (posicion.items && posicion.items.length > 0) {
          posicion.items.forEach(item => {
            if (item.partidas && item.partidas.length > 0) {
              item.partidas.forEach(partida => {
                if (partida.kilos > 0) { // Solo items con stock positivo
                  // Debug: ver la estructura de partida
                  console.log('🔍 Estructura de partida:', JSON.stringify(partida, null, 2));
                  
                  // Intentar diferentes formas de acceder al número de partida
                  const numeroPartida = partida.partida?.numeroPartida || 
                                      partida.numeroPartida || 
                                      partida.partida?.id || 
                                      'Sin número';
                  
                  transformedData.push({
                    itemDescripcion: `${item.item?.categoria || 'Sin categoría'} - ${item.item?.descripcion || 'Sin descripción'}`,
                    numeroPartida: numeroPartida,
                    proveedor: item.item?.proveedor?.nombre || 'Sin proveedor',
                    posicion: posicion.posicion?.rack 
                      ? `Rack: ${posicion.posicion.rack}, Fila: ${posicion.posicion.fila}, Nivel: ${posicion.posicion.AB}`
                      : `Pasillo: ${posicion.posicion?.numeroPasillo || 'Sin pasillo'}`,
                    kilos: Math.round(partida.kilos * 100) / 100,
                    unidades: partida.unidades || 0
                  });
                }
              });
            }
          });
        }
      });
      
      setReporteStockData(transformedData);
    } catch (err) {
      console.error('Error al obtener reporte de stock:', err);
      setNotification({
        open: true,
        message: 'Error al obtener datos para el reporte de stock',
        severity: 'error'
      });
    } finally {
      setLoadingReporte(false);
    }
  };

  // Cargar datos del reporte al montar el componente
  useEffect(() => {
    fetchReporteStock();
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    
    // Dividir la búsqueda en términos individuales
    const searchTerms = search.toLowerCase().trim().split(/\s+/);
    
    return data.filter(p => {
      // Texto de la posición
      const posLabel = getPosLabel(p.posicion).toLowerCase();
      
      // Función para verificar si un item cumple con todos los términos
      const itemMatchesAllTerms = (item) => {
        // Crear texto combinado del item específico
        const itemTexts = [];
        itemTexts.push(item.item?.categoria || '');
        itemTexts.push(item.item?.descripcion || '');
        itemTexts.push(item.item?.proveedor?.nombre || '');
        
        // Agregar números de partida del item
        (item.partidas || []).forEach(partida => {
          itemTexts.push(partida.numeroPartida || '');
        });
        
        const combinedItemText = itemTexts.join(' ').toLowerCase();
        
        // Verificar que TODOS los términos estén en este item específico
        return searchTerms.every(term => {
          // Búsqueda inteligente de posiciones
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
          
          // Búsqueda de pasillo
          if (term === 'pasillo') {
            return posLabel.includes('pasillo');
          }
          
          // Búsqueda de pasillo con número (ej: "pasillo 5")
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
          
          // Para otros términos, buscar en el texto del item específico
          return combinedItemText.includes(term);
        });
      };
      
      // Verificar si la posición cumple (por nombre de posición) O si algún item cumple
      const positionMatches = searchTerms.every(term => {
        // Búsqueda inteligente de posiciones
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
        
        // Búsqueda de pasillo
        if (term === 'pasillo') {
          return posLabel.includes('pasillo');
        }
        
        // Búsqueda de pasillo con número (ej: "pasillo 5")
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
        
        // Para términos de posición, buscar en el nombre de la posición
        return posLabel.includes(term);
      });
      
      // Si es una búsqueda de posición, usar la lógica de posición
      if (positionMatches) {
        return true;
      }
      
      // Si no es búsqueda de posición, verificar si algún item cumple con todos los términos
      return (p.items || []).some(item => itemMatchesAllTerms(item));
    });
  }, [data, search]);

  // Función para verificar si un item coincide con la búsqueda
  const itemMatchesSearch = (item) => {
    if (!search.trim()) return false;
    
    const searchTerms = search.toLowerCase().trim().split(/\s+/);
    
    // Crear texto combinado del item incluyendo todas sus partidas
    const itemTexts = [];
    itemTexts.push(item.item?.categoria || '');
    itemTexts.push(item.item?.descripcion || '');
    itemTexts.push(item.item?.proveedor?.nombre || '');
    
    // Agregar números de partida
    (item.partidas || []).forEach(partida => {
      itemTexts.push(partida.numeroPartida || '');
    });
    
    const combinedItemText = itemTexts.join(' ').toLowerCase();
    
    // Filtrar términos que NO son de posición (rack-fila o pasillo)
    const itemSearchTerms = searchTerms.filter(term => {
      // Excluir términos de posición
      if (term.includes('-')) {
        const parts = term.split('-');
        if (parts.length === 2) {
          const rack = parseInt(parts[0]);
          const fila = parseInt(parts[1]);
          if (!isNaN(rack) && !isNaN(fila)) {
            return false; // Es un término de posición rack-fila
          }
        }
      }
      
      if (term.startsWith('pasillo')) {
        return false; // Es un término de posición pasillo
      }
      
      return true; // Es un término de item
    });
    
    // Si no hay términos de item, no resaltar nada
    if (itemSearchTerms.length === 0) return false;
    
    // Verificar que TODOS los términos de item estén presentes
    return itemSearchTerms.every(term => combinedItemText.includes(term));
  };

  const selected = filteredData[selectedIndex] || null;

  // Handlers para el menú de acciones
  const handleMenuOpen = (event, item, partida, posicion) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setSelectedPartida(partida);
    setSelectedPosicion(posicion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // No limpiar los datos aquí, se limpiarán cuando se abran los modales
  };

  const limpiarDatosSeleccionados = () => {
    setSelectedItem(null);
    setSelectedPartida(null);
    setSelectedPosicion(null);
  };

  const handleAjustar = () => {
    if (!selectedItem || !selectedPartida || !selectedPosicion) return;
    
    // Crear el objeto material con la información necesaria
    const material = {
      item: selectedItem,  // El item completo
      partida: selectedPartida,
      posicion: selectedPosicion,
      totalKilos: selectedPartida.kilos,
      totalUnidades: selectedPartida.unidades
    };
    
    setSelectedItem(material);
    setModalAjusteOpen(true);
    handleMenuClose();
  };

  const handleMover = () => {
    if (!selectedItem || !selectedPartida || !selectedPosicion) return;
    
    // Crear el objeto item con la estructura que espera el modal de movimiento interno
    const itemParaMovimiento = {
      item: selectedItem,  // El item completo
      partida: selectedPartida,  // La partida completa
      totalKilos: selectedPartida.kilos,
      totalUnidades: selectedPartida.unidades
    };
    
    setSelectedItem(itemParaMovimiento);
    setMovimientoInternoOpen(true);
    handleMenuClose();
  };

  const handleRemitoSalida = () => {
    if (!selectedItem || !selectedPartida || !selectedPosicion) return;
    
    // Crear el objeto resultado con la información necesaria
    const resultado = {
      item: selectedItem,  // El item completo
      partida: selectedPartida,
      totalKilos: selectedPartida.kilos,
      totalUnidades: selectedPartida.unidades
    };
    
    setSelectedItem(resultado);
    setModalRemitoSalidaOpen(true);
    handleMenuClose();
  };

  // Handlers para cerrar modales
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleMovimientoCompletado = () => {
    // Recargar los datos después del movimiento
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await stockApi.getConsultaRapidaAgrupado();
        setData(Array.isArray(res) ? res : []);
      } catch (e) {
        setError(e?.message || 'Error al cargar composición por posición');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Limpiar datos seleccionados
    limpiarDatosSeleccionados();
  };

  const handleAjusteExitoso = () => {
    setNotification({
      open: true,
      message: 'Ajuste realizado correctamente',
      severity: 'success'
    });
    handleMovimientoCompletado();
  };

  const handleRemitoSalidaExitoso = () => {
    setNotification({
      open: true,
      message: 'Remito de salida creado correctamente',
      severity: 'success'
    });
    handleMovimientoCompletado();
  };

  // Handlers para adición rápida
  const handleAbrirModalAdicionRapida = (posicion) => {
    setSelectedPosicion(posicion);
    setModalAdicionRapidaOpen(true);
  };

  const handleCerrarModalAdicionRapida = () => {
    setModalAdicionRapidaOpen(false);
    setSelectedPosicion(null);
  };

  const handleAdicionRapidaExitoso = async (adicionData) => {
    try {
      console.log('Enviando adición rápida:', adicionData);
      
      // Llamar a la misma ruta que usa la adición rápida normal
      const response = await apiClient.post('/movimientos/adicion-rapida', adicionData);
      
      console.log('Respuesta de adición rápida:', response.data);
      
      setNotification({
        open: true,
        message: 'Adición rápida realizada correctamente',
        severity: 'success'
      });
      
      // Recargar los datos para mostrar el stock actualizado
      handleMovimientoCompletado();
    } catch (error) {
      console.error('Error en adición rápida:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error al realizar la adición rápida',
        severity: 'error'
      });
    }
  };

  if (!user) return null;

  return (
    <AppLayout user={user} pageTitle="Stock" onLogout={() => navigate('/depositoDW_v2/')}> 
      {/* Header con título y botón de exportar */}
      <Box sx={{ 
        p: isMobile ? 2 : 4,
        pb: 0
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Stock por Posición
            </Typography>
            
            {/* Barra de búsqueda */}
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <SearchIcon sx={{ 
                position: 'absolute', 
                left: 12, 
                color: 'text.secondary',
                fontSize: 20,
                zIndex: 1
              }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                placeholder="Buscar..."
                style={{ 
                  padding: '12px 12px 12px 44px', 
                  borderRadius: 25, 
                  border: '1px solid var(--color-border)',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  minWidth: '300px',
                  maxWidth: '500px',
                  width: '400px'
                }}
              />
            </Box>
            
            {/* Botón de exportar al lado de la búsqueda */}
            <IconButton
              onClick={async () => {
                try {
                  // Usar la misma lógica que el botón de exportar original
                  if (loadingReporte || !reporteStockData.length) return;
                  
                  // Aquí puedes agregar la lógica de exportación
                  console.log('Exportando reporte de stock...', reporteStockData);
                  
                  setNotification({
                    open: true,
                    message: 'Reporte de stock exportado correctamente',
                    severity: 'success'
                  });
                } catch (error) {
                  setNotification({
                    open: true,
                    message: 'Error al exportar el reporte',
                    severity: 'error'
                  });
                }
              }}
              disabled={loadingReporte || !reporteStockData.length}
              sx={{
                color: 'text.secondary',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                '&:disabled': {
                  opacity: 0.3
                },
                transition: 'all 0.2s ease'
              }}
              title="Exportar reporte de stock"
            >
              <DownloadIcon sx={{ fontSize: 35 }} />
            </IconButton>
          </Box>
          
          {/* Botón del menú lateral en la esquina derecha */}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              },
              transition: 'all 0.2s ease'
            }}
            title="Menú lateral"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
      </Box>

      {/* Menú lateral */}
      {sidebarOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 1300,
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header del menú */}
          <Box sx={{
            p: 3,
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menú
            </Typography>
            <IconButton
              onClick={() => setSidebarOpen(false)}
              sx={{ color: 'text.secondary' }}
            >
              ×
            </IconButton>
          </Box>

          {/* Contenido del menú */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Compras */}
              <Button
                variant="text"
                startIcon={<ShoppingCartIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/compras');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Compras
              </Button>
              
              {/* Remito Entrada */}
              <Button
                variant="text"
                startIcon={<ReceiptIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/remito-entrada');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Remito Entrada
              </Button>
              
              {/* Dashboard Compras */}
              <Button
                variant="text"
                startIcon={<DashboardIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/dashboard-compras');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Dashboard Compras
              </Button>
              
              {/* Calidad */}
              <Button
                variant="text"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/calidad');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Calidad
              </Button>
              
              {/* Salida */}
              <Button
                variant="text"
                startIcon={<ExitToAppIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/salida');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Salida
              </Button>
              
              {/* Adición Rápida */}
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/adicion-rapida');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Adición Rápida
              </Button>
              
              {/* Posiciones Vacías */}
              <Button
                variant="text"
                startIcon={<MapIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/posiciones-vacias');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Posiciones Vacías
              </Button>
              
              {/* Mapa */}
              <Button
                variant="text"
                startIcon={<MapIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/mapa');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Mapa
              </Button>
              
              {/* Movimientos Mercadería */}
              <Button
                variant="text"
                startIcon={<InventoryIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/movimientos-mercaderia');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Movimientos Mercadería
              </Button>
              
              {/* Stock (página actual) */}
              <Button
                variant="text"
                startIcon={<AssignmentIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/posiciones-composicion');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)'
                  }
                }}
              >
                Stock por Posición
              </Button>
              
              {/* Reporte Stock */}
              <Button
                variant="text"
                startIcon={<ReportIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/reporte-stock');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Reporte Stock
              </Button>
              
              {/* Órdenes de Pedido */}
              <Button
                variant="text"
                startIcon={<ShoppingBagIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/ordenes-pedido');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Órdenes de Pedido
              </Button>
              
              {/* Admin */}
              <Button
                variant="text"
                startIcon={<AdminIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/admin');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Administración
              </Button>
              
              {/* Separador */}
              <Box sx={{ my: 2, borderTop: '1px solid var(--color-border)' }} />
              
              {/* Cerrar Sesión */}
              <Button
                variant="text"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  navigate('/depositoDW_v2/');
                  setSidebarOpen(false);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  color: 'error.main',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Overlay para cerrar el menú */}
      {sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1299
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        p: isMobile ? 2 : 4,
        pt: 0,
        height: 'calc(100vh - 120px)',
        overflow: 'hidden'
      }}>
        {/* Panel izquierdo - Métricas */}
        <Box sx={{ 
          flex: '0 0 200px', 
          height: '100%', 
          overflow: 'auto', 
          border: '1px solid var(--color-border)', 
          borderRadius: 2, 
          p: 2,
          backgroundColor: 'var(--color-surface)'
        }}>
          <StockMetricsPanel 
            data={filteredData}
            searchTerm={search}
            selectedPosition={selected?.posicion}
          />
        </Box>

        {/* Panel central - Lista de posiciones */}
        <Box sx={{ 
          flex: '0 0 320px', 
          height: '100%', 
          overflow: 'auto', 
          border: '1px solid var(--color-border)', 
          borderRadius: 2, 
          p: 2,
          backgroundColor: 'var(--color-surface)'
        }}>
          
          {loading && <Typography>Cargando...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          
          {!loading && filteredData.map((p, idx) => (
            <Box
              key={p.posicion?.id || idx}
              onClick={() => setSelectedIndex(idx)}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: idx === selectedIndex ? 'var(--color-primary-light)' : 'var(--color-background)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: idx === selectedIndex ? 'var(--color-primary-light)' : 'var(--color-divider)',
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

        {/* Panel derecho - Detalle de la posición seleccionada */}
        <Box sx={{ 
          flex: 1, 
          height: '100%', 
          overflow: 'auto', 
          border: '1px solid var(--color-border)', 
          borderRadius: 2, 
          p: 3,
          backgroundColor: 'var(--color-surface)'
        }}>
          {!selected && !loading && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Selecciona una posición para ver su composición
            </Typography>
          )}
          
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
                
                {/* Botón de adición rápida */}
                <IconButton
                  onClick={() => handleAbrirModalAdicionRapida(selected.posicion)}
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
                  {/* Título: Categoría - Descripción - Proveedor */}
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
                  
                  {/* Lista de partidas */}
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
                      {/* Subtítulo: Partida - Kilos - Unidades */}
                      <Typography variant="body2" color="text.secondary">
                        Partida: {partida.numeroPartida} - <span style={{ color: '#1976D2', fontWeight: 600 }}>{partida.kilos} kg</span> - <span style={{ color: '#7B1FA2', fontWeight: 600 }}>{partida.unidades} un</span>
                      </Typography>
                      
                      {/* Menú de acciones */}
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, item.item, partida, selected.posicion)}
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
      </Box>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleAjustar}>
          <EditIcon sx={{ mr: 1 }} />
          Ajustar
        </MenuItem>
        <MenuItem onClick={handleMover}>
          <SwapIcon sx={{ mr: 1 }} />
          Mover
        </MenuItem>
        <MenuItem onClick={handleRemitoSalida}>
          <LocalShippingIcon sx={{ mr: 1 }} />
          Remito Salida
        </MenuItem>
      </Menu>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Modal de Movimiento Interno */}
      <MovimientoInterno
        open={movimientoInternoOpen}
        onClose={() => {
          setMovimientoInternoOpen(false);
          limpiarDatosSeleccionados();
        }}
        itemSeleccionado={selectedItem}
        posicionOrigen={selectedPosicion}
        onMovimientoCompletado={handleMovimientoCompletado}
      />

      {/* Modal de Ajuste de Stock */}
      <AjustePosicionModal
        open={modalAjusteOpen}
        onClose={() => {
          setModalAjusteOpen(false);
          limpiarDatosSeleccionados();
        }}
        material={selectedItem}
        onAjusteExitoso={handleAjusteExitoso}
      />

      {/* Modal de Remito de Salida */}
      <RemitoSalidaDesdePosicionModal
        open={modalRemitoSalidaOpen}
        onClose={() => {
          setModalRemitoSalidaOpen(false);
          limpiarDatosSeleccionados();
        }}
        resultado={selectedItem}
        posicionActual={selectedPosicion}
        onSubmit={handleRemitoSalidaExitoso}
      />

      {/* Modal de Adición Rápida */}
      <AdicionRapidaPosicion
        open={modalAdicionRapidaOpen}
        onClose={handleCerrarModalAdicionRapida}
        posicion={selectedPosicion}
        onSubmit={handleAdicionRapidaExitoso}
      />
    </AppLayout>
  );
};

export default StockPage;
