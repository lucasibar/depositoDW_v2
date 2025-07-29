import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { fetchPresupuesto, createPresupuesto } from "../../../../features/presupuesto/model/slice";
import { selectPresupuesto, selectPresupuestoLoading, selectPresupuestoError } from "../../../../features/presupuesto/model/selectors";
import styles from "./PresupuestoTab.module.css";

export const PresupuestoTab = () => {
  const dispatch = useDispatch();
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.presupuestoTab}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Presupuesto
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreatePresupuesto}
          sx={{ mb: 2 }}
        >
          Crear Nuevo Presupuesto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Presupuestos ({presupuesto.length})
        </Typography>
        
        {presupuesto.length === 0 ? (
          <Typography color="textSecondary">
            No hay presupuestos. Crea uno nuevo para comenzar.
          </Typography>
        ) : (
          <Box>
            {presupuesto.map((pres) => (
              <Box 
                key={pres.id} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Presupuesto #{pres.numero}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Descripción: {pres.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Monto: ${pres.monto}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha: {new Date(pres.fecha).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};
