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
import { Add as AddIcon, Assessment as AssessmentIcon } from "@mui/icons-material";
import { fetchPresupuesto, createPresupuesto } from "../../../../features/presupuesto/model/slice";
import { selectPresupuesto, selectPresupuestoLoading, selectPresupuestoError } from "../../../../features/presupuesto/model/selectors";
import ModernCard from "../../../../shared/ui/ModernCard/ModernCard";
import EmptyState from "../../../../shared/ui/EmptyState/EmptyState";

export const PresupuestoTab = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const presupuesto = useSelector(selectPresupuesto);
  const isLoading = useSelector(selectPresupuestoLoading);
  const error = useSelector(selectPresupuestoError);

  useEffect(() => {
    dispatch(fetchPresupuesto());
  }, [dispatch]);

  const handleCreatePresupuesto = () => {
    // Aquí puedes abrir un modal o navegar a un formulario de creación
    console.log("Crear nuevo presupuesto");
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
        title={isMobile ? undefined : "Presupuesto"}
        subtitle={isMobile ? undefined : "Gestión de presupuestos"}
        headerAction={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreatePresupuesto}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isMobile ? "Nuevo" : "Crear Presupuesto"}
          </Button>
        }
        padding={isMobile ? "compact" : "normal"}
        sx={{ mb: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Total de presupuestos:
          </Typography>
          <Chip 
            label={presupuesto.length} 
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

      {/* Lista de presupuestos */}
      <ModernCard
        title={isMobile ? undefined : "Lista de Presupuestos"}
        subtitle={isMobile ? undefined : `Mostrando ${presupuesto.length} presupuestos`}
        padding={isMobile ? "compact" : "normal"}
      >
        {presupuesto.length === 0 ? (
          <EmptyState
            title="No hay presupuestos"
            subtitle="Crea tu primer presupuesto para comenzar a gestionar los gastos de la empresa"
            icon={AssessmentIcon}
            actionLabel="Crear Primer Presupuesto"
            onAction={handleCreatePresupuesto}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {presupuesto.map((pres) => (
              <ModernCard
                key={pres.id}
                title={`Presupuesto #${pres.numero}`}
                subtitle={pres.descripcion}
                padding="compact"
                elevation={0}
                sx={{ 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)'
                }}
                headerAction={
                  <Chip 
                    label={`$${pres.monto.toLocaleString()}`}
                    color="success"
                    size="small"
                  />
                }
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Descripción: {pres.descripcion}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monto: ${pres.monto.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {new Date(pres.fecha).toLocaleDateString()}
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
