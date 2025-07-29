import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { fetchRemitos, createRemito } from "../../../../features/remitos/model/slice";
import { selectRemitos, selectRemitosLoading, selectRemitosError } from "../../../../features/remitos/model/selectors";
import styles from "./RemitosTab.module.css";

export const RemitosTab = () => {
  const dispatch = useDispatch();
  const remitos = useSelector(selectRemitos);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);

  useEffect(() => {
    dispatch(fetchRemitos());
  }, [dispatch]);

  const handleCreateRemito = () => {
    // Aquí puedes abrir un modal o navegar a un formulario de creación
    console.log("Crear nuevo remito");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.remitosTab}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Gestión de Remitos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateRemito}
          sx={{ mb: 2 }}
        >
          Crear Nuevo Remito
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Remitos ({remitos.length})
        </Typography>
        
        {remitos.length === 0 ? (
          <Typography color="textSecondary">
            No hay remitos cargados. Crea uno nuevo para comenzar.
          </Typography>
        ) : (
          <Box>
            {remitos.map((remito) => (
              <Box 
                key={remito.id} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Remito #{remito.numero}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proveedor: {remito.proveedor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha: {new Date(remito.fecha).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};
