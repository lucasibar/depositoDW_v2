import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton
} from '@mui/material';
import { 
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
  Logout as LogoutIcon,
  Add as AddIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const PageNavigationMenu = ({ user, currentPath }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate('/depositoDW_v2/');
    setSidebarOpen(false);
  };

  const isCurrentPage = (path) => {
    return currentPath === path;
  };

  return (
    <>
      {/* Botón del menú lateral */}
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
              {(user?.role === 'admin' || user?.role === 'compras') && (
                <Button
                  variant="text"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/compras')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/compras') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/compras') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/compras') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Compras
                </Button>
              )}
              
              {/* Remito Entrada */}
              {(user?.role === 'admin' || user?.role === 'compras') && (
                <Button
                  variant="text"
                  startIcon={<ReceiptIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/remito-entrada')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/remito-entrada') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/remito-entrada') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/remito-entrada') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Remito Entrada
                </Button>
              )}
              
              {/* Dashboard Compras */}
              {(user?.role === 'admin' || user?.role === 'compras') && (
                <Button
                  variant="text"
                  startIcon={<DashboardIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/dashboard-compras')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/dashboard-compras') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/dashboard-compras') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/dashboard-compras') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Dashboard Compras
                </Button>
              )}
              
              {/* Calidad */}
              {(user?.role === 'admin' || user?.role === 'calidad') && (
                <Button
                  variant="text"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/calidad')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/calidad') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/calidad') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/calidad') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Calidad
                </Button>
              )}
              
              {/* Salida */}
              {(user?.role === 'admin' || user?.role === 'salida') && (
                <Button
                  variant="text"
                  startIcon={<ExitToAppIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/salida')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/salida') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/salida') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/salida') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Salida
                </Button>
              )}
              
              {/* Adición Rápida */}
              {(user?.role === 'admin' || user?.role === 'deposito' || user?.role === 'usuario') && (
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/adicion-rapida')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/adicion-rapida') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/adicion-rapida') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/adicion-rapida') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Adición Rápida
                </Button>
              )}
              
              {/* Posiciones Vacías */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<MapIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/posiciones-vacias')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/posiciones-vacias') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/posiciones-vacias') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/posiciones-vacias') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Posiciones Vacías
                </Button>
              )}
              
              {/* Mapa */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<MapIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/mapa')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/mapa') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/mapa') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/mapa') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Mapa
                </Button>
              )}
              
              {/* Mapa de Chequeos por Tiempo */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<TimelineIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/mapa-chequeos-tiempo')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/mapa-chequeos-tiempo') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/mapa-chequeos-tiempo') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/mapa-chequeos-tiempo') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Mapa Chequeos por Tiempo
                </Button>
              )}
              
              {/* Dashboard de Tareas */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/dashboard-tareas')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/dashboard-tareas') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/dashboard-tareas') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/dashboard-tareas') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Dashboard de Tareas
                </Button>
              )}
              
              {/* Movimientos Mercadería */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<InventoryIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/movimientos-mercaderia')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/movimientos-mercaderia') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/movimientos-mercaderia') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/movimientos-mercaderia') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Movimientos Mercadería
                </Button>
              )}
              
              {/* Stock */}
              {(user?.role === 'admin' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/posiciones-composicion')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/posiciones-composicion') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/posiciones-composicion') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/posiciones-composicion') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Stock por Posición
                </Button>
              )}
              
              {/* Reporte Stock */}
              {(user?.role === 'admin' || user?.role === 'compras' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<ReportIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/reporte-stock')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/reporte-stock') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/reporte-stock') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/reporte-stock') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Reporte Stock
                </Button>
              )}
              
              {/* Órdenes de Pedido */}
              {(user?.role === 'admin' || user?.role === 'compras' || user?.role === 'deposito') && (
                <Button
                  variant="text"
                  startIcon={<ShoppingBagIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/ordenes-pedido')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/ordenes-pedido') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/ordenes-pedido') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/ordenes-pedido') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Órdenes de Pedido
                </Button>
              )}
              
              {/* Admin */}
              {user?.role === 'admin' && (
                <Button
                  variant="text"
                  startIcon={<AdminIcon />}
                  onClick={() => handleNavigation('/depositoDW_v2/admin')}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: isCurrentPage('/depositoDW_v2/admin') ? 'primary.main' : 'text.primary',
                    backgroundColor: isCurrentPage('/depositoDW_v2/admin') ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isCurrentPage('/depositoDW_v2/admin') ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Administración
                </Button>
              )}
              
              {/* Separador */}
              <Box sx={{ my: 2, borderTop: '1px solid var(--color-border)' }} />
              
              {/* Cerrar Sesión */}
              <Button
                variant="text"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
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
    </>
  );
};

export default PageNavigationMenu;
