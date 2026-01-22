import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { selectRemitosLoading, selectRemitosError } from '../../features/remitos/model/selectors';
import { CreateRemitoEntradaForm } from '../../widgets/remitos/CreateRemitoEntradaForm/CreateRemitoEntradaForm';

export const RemitoEntradaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [user, setUser] = useState(null);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  const handleRemitoCreated = (remitoData) => {
    // Aquí puedes agregar lógica adicional después de crear el remito
    console.log('Remito creado:', remitoData);
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Remito Entrada">
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Contenido principal */}
        <ModernCard
          title={isMobile ? undefined : "Crear Remito de Entrada"}
          subtitle={isMobile ? undefined : "Complete los datos para generar un nuevo remito"}
          padding={isMobile ? "compact" : "normal"}
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          <Box sx={{ width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <CreateRemitoEntradaForm onRemitoCreated={handleRemitoCreated} />
          </Box>
        </ModernCard>
      </Container>
    </AppLayout>
  );
};
