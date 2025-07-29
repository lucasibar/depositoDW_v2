import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { fetchOrdenesCompra, createOrdenCompra } from "../../../../features/ordenesCompra/model/slice";
import { selectOrdenesCompra, selectOrdenesCompraLoading, selectOrdenesCompraError } from "../../../../features/ordenesCompra/model/selectors";
import styles from "./OrdenesCompraTab.module.css";

export const OrdenesCompraTab = () => {
  const dispatch = useDispatch();
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.ordenesTab}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Órdenes de Compra
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateOrden}
          sx={{ mb: 2 }}
        >
          Crear Nueva Orden
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Órdenes ({ordenesCompra.length})
        </Typography>
        
        {ordenesCompra.length === 0 ? (
          <Typography color="textSecondary">
            No hay órdenes de compra. Crea una nueva para comenzar.
          </Typography>
        ) : (
          <Box>
            {ordenesCompra.map((orden) => (
              <Box 
                key={orden.id} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Orden #{orden.numero}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proveedor: {orden.proveedor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha: {new Date(orden.fecha).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Estado: {orden.estado}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};
