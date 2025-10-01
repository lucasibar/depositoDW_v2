import React from 'react';
import { 
  Box, 
  Typography, 
  useTheme,
  useMediaQuery,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { useReporteStock } from '../../features/movimientos/hooks/useReporteStock';
import { ExportReporteStockButton } from '../../shared/ui/ExportReporteStockButton';

export const ReporteStockPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del usuario y autenticación
  const [user, setUser] = React.useState(null);

  // Hook para obtener datos del reporte
  const { data, loading, error, refetch } = useReporteStock();

  // Inicialización y autenticación
  React.useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Handlers de navegación
  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  // Calcular totales
  const totalKilos = data.reduce((sum, item) => sum + (item.kilos || 0), 0);
  const totalUnidades = data.reduce((sum, item) => sum + (item.unidades || 0), 0);

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Reporte Stock Consolidado">
      <Box sx={{ 
        p: isMobile ? 2 : 4,
        overflow: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <Box sx={{ 
          mb: isMobile ? 2 : 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                mb: 0.5
              }}
            >
              Reporte de Stock Consolidado
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: isMobile ? 1 : 3
              }}
            >
              Stock consolidado por partida, item y posición con cálculo de kilos totales
            </Typography>
          </Box>
          {!isMobile && (
            <PageNavigationMenu user={user} currentPath={location.pathname} />
          )}
        </Box>

        {/* Controles */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 3,
          alignItems: isMobile ? 'stretch' : 'center'
        }}>
          <ExportReporteStockButton 
            data={data} 
            disabled={loading || error || !data.length}
          />
          
          <Tooltip title="Actualizar datos">
            <IconButton 
              onClick={refetch}
              disabled={loading}
              sx={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)',
                },
                '&:disabled': {
                  backgroundColor: 'var(--color-disabled)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Resumen */}
        {!loading && !error && data.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'var(--color-background-secondary)' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 3,
              justifyContent: 'space-around'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {data.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Items con Stock
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {totalKilos.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Kilos
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {totalUnidades}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Unidades
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabla de datos */}
        {!loading && !error && data.length > 0 && (
          <TableContainer component={Paper} sx={{ maxHeight: '600px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nº</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Partida</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Posición</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kilos</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Unidades</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ maxWidth: '300px' }}>
                      <Typography variant="body2" noWrap>
                        {item.itemDescripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.numeroPartida}</TableCell>
                    <TableCell>{item.proveedor}</TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Typography variant="body2" noWrap>
                        {item.posicion}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {item.kilos.toFixed(2)}
                    </TableCell>
                    <TableCell>{item.unidades}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mensaje cuando no hay datos */}
        {!loading && !error && data.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No hay datos de stock disponibles
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              No se encontraron registros con stock positivo
            </Typography>
          </Paper>
        )}
      </Box>
    </AppLayout>
  );
};
