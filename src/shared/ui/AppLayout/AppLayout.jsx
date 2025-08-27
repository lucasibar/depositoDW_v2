import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  ListItemButton,
  ListSubheader
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExitToAppIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoleColor, getRoleLabel } from '../../../features/stock/utils/userUtils';

const AppLayout = ({ children, user, onLogout, pageTitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Función para obtener el título de la página basado en la ruta
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = location.pathname;
    if (path.includes('/posiciones')) return 'Posiciones';
    if (path.includes('/adicion-rapida')) return 'Adición Rápida';
    if (path.includes('/materiales')) return 'Materiales';
    if (path.includes('/stock')) return 'Stock';
    if (path.includes('/compras')) return 'Compras';
    if (path.includes('/calidad')) return 'Calidad';
    if (path.includes('/salida')) return 'Salida';
    if (path.includes('/admin')) return 'Dashboard';
    if (path.includes('/reportes')) return 'Reportes';
    return 'Der Will';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const navigationItems = [
    {
      section: 'Operaciones',
      items: [
        {
          label: 'Adición Rápida',
          path: '/depositoDW_v2/adicion-rapida',
          icon: <AddIcon />,
          show: user?.role === 'admin' || user?.role === 'deposito' || user?.role === 'usuario'
        },
        {
          label: 'Materiales',
          path: '/depositoDW_v2/materiales',
          icon: <CategoryIcon />,
          show: user?.role === 'admin' || user?.role === 'deposito' || user?.role === 'usuario'
        },
        {
          label: 'Posiciones',
          path: '/depositoDW_v2/posiciones',
          icon: <LocationIcon />,
          show: user?.role === 'admin' || user?.role === 'deposito'
        },
        {
          label: 'Stock',
          path: '/depositoDW_v2/stock',
          icon: <InventoryIcon />,
          show: user?.role === 'admin' || user?.role === 'compras' || user?.role === 'deposito'
        },
        {
          label: 'Compras',
          path: '/depositoDW_v2/compras',
          icon: <ShoppingCartIcon />,
          show: user?.role === 'admin' || user?.role === 'compras'
        },
        {
          label: 'Dashboard Compras',
          path: '/depositoDW_v2/dashboard-compras',
          icon: <DashboardIcon />,
          show: user?.role === 'admin' || user?.role === 'compras'
        },
        {
          label: 'Calidad',
          path: '/depositoDW_v2/calidad',
          icon: <CheckCircleIcon />,
          show: user?.role === 'admin'
        },
        {
          label: 'Salida',
          path: '/depositoDW_v2/salida',
          icon: <ExitToAppIcon />,
          show: user?.role === 'admin'
        }
      ]
    },
    {
      section: 'Administración',
      items: [
        {
          label: 'Dashboard',
          path: '/depositoDW_v2/admin',
          icon: <DashboardIcon />,
          show: user?.role === 'admin'
        },
        {
          label: 'Reportes',
          path: '/depositoDW_v2/reportes',
          icon: <AssessmentIcon />,
          show: user?.role === 'admin'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ 
      width: 280, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)'
    }}>
      {/* Header con logo y branding */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Der Will
          </Typography>
          <Typography variant="body2" sx={{ 
            opacity: 0.9,
            fontWeight: 500
          }}>
            Sistema de Gestión
          </Typography>
        </Box>
      </Box>
      
      {/* Información del usuario */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          p: 2.5, 
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Avatar 
            sx={{ 
              bgcolor: 'var(--color-primary)',
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.name || 'Usuario'}
            </Typography>
            <Chip 
              label={getRoleLabel(user?.role)} 
              color={getRoleColor(user?.role)}
              size="small"
              sx={{ 
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navegación */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {navigationItems.map((section, sectionIndex) => (
          <Box key={section.section}>
            <ListSubheader sx={{ 
              px: 3, 
              py: 1.5,
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.section}
            </ListSubheader>
            <List sx={{ p: 0 }}>
              {section.items.filter(item => item.show).map((item) => (
                <ListItem key={item.path} sx={{ p: 0, px: 1.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 'var(--border-radius-md)',
                      mx: 0.5,
                      mb: 0.5,
                      backgroundColor: isActiveRoute(item.path) 
                        ? 'var(--color-primary)' 
                        : 'transparent',
                      color: isActiveRoute(item.path) 
                        ? 'white' 
                        : 'var(--color-text-primary)',
                      '&:hover': {
                        backgroundColor: isActiveRoute(item.path)
                          ? 'var(--color-primary-dark)'
                          : 'var(--color-divider)'
                      },
                      transition: 'var(--transition-normal)'
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActiveRoute(item.path) 
                        ? 'white' 
                        : 'var(--color-text-secondary)',
                      minWidth: 40
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: { 
                          fontWeight: isActiveRoute(item.path) ? 600 : 500,
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {sectionIndex < navigationItems.length - 1 && (
              <Divider sx={{ my: 1, mx: 3 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer con opciones de usuario */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ mb: 2 }} />
        
        {/* Opciones de usuario */}
        <List sx={{ p: 0 }}>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton
              sx={{
                borderRadius: 'var(--border-radius-md)',
                mx: 0.5,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'var(--color-divider)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'var(--color-text-secondary)', minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Configuración"
                primaryTypographyProps={{
                  sx: { fontWeight: 500, fontSize: '0.9rem' }
                }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem sx={{ p: 0 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 'var(--border-radius-md)',
                mx: 0.5,
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: 'var(--color-error)',
                '&:hover': {
                  backgroundColor: 'var(--color-error)',
                  color: 'white'
                },
                transition: 'var(--transition-normal)'
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit',
                minWidth: 40
              }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar Sesión"
                primaryTypographyProps={{
                  sx: { fontWeight: 600, fontSize: '0.9rem' }
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* AppBar para móvil */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            zIndex: theme.zIndex.drawer + 1,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar para desktop */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{ 
            width: 280, 
            flexShrink: 0,
            backgroundColor: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {drawer}
        </Box>
      )}

      {/* Drawer móvil */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              backgroundColor: 'var(--color-surface)',
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'var(--color-background)',
          minHeight: '100vh',
          pt: isMobile ? '64px' : 0,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout; 