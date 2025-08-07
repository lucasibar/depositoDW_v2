import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Add as AddIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { fetchOrdenesCompra, createOrdenCompra } from "../../../../features/ordenesCompra/model/slice";
import { selectOrdenesCompra, selectOrdenesCompraLoading, selectOrdenesCompraError } from "../../../../features/ordenesCompra/model/selectors";
import ModernCard from "../../../../shared/ui/ModernCard/ModernCard";
import EmptyState from "../../../../shared/ui/EmptyState/EmptyState";

export const OrdenesCompraTab = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const ordenesCompra = useSelector(selectOrdenesCompra);
  const isLoading = useSelector(selectOrdenesCompraLoading);
  const error = useSelector(selectOrdenesCompraError);

  useEffect(() => {
    dispatch(fetchOrdenesCompra());
  }, [dispatch]);

  const handleCreateOrden = () => {
    // Aquí puedes abrir un modal o navegar a un formulario de creación
    console.log("Crear nueva orden de compra");
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header con botón de crear */}
      <ModernCard
        title={isMobile ? undefined : "Órdenes de Compra"}
        subtitle={isMobile ? undefined : "Gestión de órdenes de compra"}
        headerAction={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateOrden}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isMobile ? "Nueva" : "Crear Orden"}
          </Button>
        }
        padding={isMobile ? "compact" : "normal"}
        sx={{ mb: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Total de órdenes:
          </Typography>
          <Chip 
            label={ordenesCompra.length} 
            color="primary" 
            size="small"
          />
        </Box>
      </ModernCard>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lista de órdenes */}
      <ModernCard
        title={isMobile ? undefined : "Lista de Órdenes"}
        subtitle={isMobile ? undefined : `Mostrando ${ordenesCompra.length} órdenes`}
        padding={isMobile ? "compact" : "normal"}
      >
        {ordenesCompra.length === 0 ? (
          <EmptyState
            title="No hay órdenes de compra"
            subtitle="Crea tu primera orden de compra para comenzar a gestionar las compras de la empresa"
            icon={ShoppingCartIcon}
            actionLabel="Crear Primera Orden"
            onAction={handleCreateOrden}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ordenesCompra.map((orden) => (
              <ModernCard
                key={orden.id}
                title={`Orden #${orden.numero}`}
                subtitle={`Proveedor: ${orden.proveedor}`}
                padding="compact"
                elevation={0}
                sx={{ 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)'
                }}
                headerAction={
                  <Chip 
                    label={orden.estado} 
                    color={
                      orden.estado === 'Aprobada' ? 'success' : 
                      orden.estado === 'Pendiente' ? 'warning' : 'default'
                    }
                    size="small"
                  />
                }
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {new Date(orden.fecha).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Estado: {orden.estado}
                  </Typography>
                </Box>
              </ModernCard>
            ))}
          </Box>
        )}
      </ModernCard>
    </Box>
  );
};
