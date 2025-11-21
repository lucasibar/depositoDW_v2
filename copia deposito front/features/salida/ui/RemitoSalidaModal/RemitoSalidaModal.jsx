import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { dataProveedoresItems } from "../../../remitos/model/slice";

export default function RemitoSalidaModal({ open, onClose, item, posicionId, onSubmit }) {
  const dispatch = useDispatch();

  // Obtener la lista de proveedores desde Redux
  const proveedores = useSelector((state) => state.remitos?.proveedores) || [];

  // Filtrar proveedores que tengan "cliente" en su categoría
  const proveedoresFiltrados = proveedores.filter((prov) =>
    prov.categoria?.toLowerCase().includes("cliente")
  );

  const [proveedor, setProveedor] = useState("");
  const [kilos, setKilos] = useState(0);
  const [unidades, setUnidades] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (item) {
      setKilos(item.kilos || 0);
      setUnidades(item.unidades || 0);
    }
  }, [item]);

  // Cargar proveedores al abrir el modal
  useEffect(() => {
    if (open && (!proveedores || proveedores.length === 0)) {
      dispatch(dataProveedoresItems());
    }
  }, [open, dispatch, proveedores]);

  const handleProveedorChange = (e) => {
    setProveedor(e.target.value);
  };

  const handleUnidadesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    // Calcular kilos proporcionalmente a las unidades y redondear a entero
    const kilosCalculados = Math.round((item.kilos / item.unidades) * value);
    setKilos(kilosCalculados);
    setUnidades(value);
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleSubmit = () => {
    if (!proveedor || !fecha) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    if (kilos > item.kilos || unidades > item.unidades) {
      alert("No puede sacar más mercadería de la que hay disponible");
      return;
    }

    if (kilos <= 0 || unidades <= 0) {
      alert("Los valores de kilos y unidades deben ser mayores a 0");
      return;
    }

    // Crear los datos del remito
    const remitoData = {
      selectedItem: {
        itemId: item.itemId || item.id,
        categoria: item.categoria,
        descripcion: item.descripcion,
        proveedor: item.proveedor,
        partida: item.partida,
        kilos: item.kilos,
        unidades: item.unidades
      },
      kilos: parseFloat(kilos),
      unidades: parseInt(unidades),
      id: posicionId,
      proveedor: proveedor,
      fecha: fecha
    };

    // Llamar a la función onSubmit que se pasa como prop
    if (onSubmit) {
      onSubmit(remitoData);
    }
    
    onClose();
  };

  // Función para validar que todos los campos estén completos
  const isFormValid = () => {
    return proveedor && fecha && kilos > 0 && unidades > 0;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Agregar a Remito de Salida</DialogTitle>
      <DialogContent>
        {proveedores.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Cliente"
              value={proveedor}
              onChange={handleProveedorChange}
              select
              fullWidth
              required
            >
              {proveedoresFiltrados.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.nombre}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" component="h6">
              Kilos: {kilos}
            </Typography>
            
            <TextField
              label="Unidades"
              type="number"
              value={unidades}
              onChange={handleUnidadesChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: item?.unidades || 0 }}
            />
            
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={handleFechaChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Información del item seleccionado */}
            {item && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  Material seleccionado:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.categoria} - {item.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock disponible: {item.kilos?.toFixed(2)} kg / {item.unidades} unidades
                </Typography>
                {item.proveedor?.nombre && (
                  <Typography variant="body2" color="textSecondary">
                    Proveedor: {item.proveedor.nombre}
                  </Typography>
                )}
                {item.partida && (
                  <Typography variant="body2" color="textSecondary">
                    Partida: {item.partida}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid()}
        >
          Agregar al Remito
        </Button>
      </DialogActions>
    </Dialog>
  );
} 