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
import { apiClient } from "../../../../config/api";

export default function RemitoSalidaDesdePosicionModal({ open, onClose, resultado, posicionActual, onSubmit }) {
  const dispatch = useDispatch();

  // Obtener la lista de proveedores desde Redux
  const proveedores = useSelector((state) => state.remitos?.proveedores) || [];

  // Filtrar proveedores que tengan "cliente" en su categoría
  const proveedoresFiltrados = proveedores.filter((prov) =>
    prov.categoria?.toLowerCase().includes("cliente")
  );

  const [proveedor, setProveedor] = useState("");
  const [cajas, setCajas] = useState("");
  const [kilos, setKilos] = useState(0);
  const [unidades, setUnidades] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resultado) {
      setKilos(resultado.totalKilos || 0);
      setUnidades(resultado.totalUnidades || 0);
    }
  }, [resultado]);

  // Cargar proveedores al abrir el modal
  useEffect(() => {
    if (open && (!proveedores || proveedores.length === 0)) {
      dispatch(dataProveedoresItems());
    }
  }, [open, dispatch, proveedores]);

  const handleProveedorChange = (e) => {
    setProveedor(e.target.value);
  };

  // Función para calcular kilos automáticamente basado en cajas
  const calcularKilosPorCajas = (cajas, totalKilos, totalUnidades) => {
    if (!cajas || !totalKilos || !totalUnidades || totalUnidades === 0) {
      return 0;
    }
    
    const cajasNum = parseInt(cajas);
    if (cajasNum <= 0) return 0;
    
    // Calcular kilos por caja: totalKilos / totalUnidades
    const kilosPorCaja = totalKilos / totalUnidades;
    
    // Calcular kilos totales para las cajas seleccionadas
    const kilosCalculados = kilosPorCaja * cajasNum;
    
    // Redondear a número entero
    return Math.round(kilosCalculados);
  };

  const handleCajasChange = (e) => {
    const value = e.target.value;
    setCajas(value);
    
    if (value && resultado) {
      const kilosCalculados = calcularKilosPorCajas(value, resultado.totalKilos, resultado.totalUnidades);
      setKilos(kilosCalculados);
      setUnidades(parseInt(value) || 0);
    }
  };

  const handleUnidadesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    // Calcular kilos proporcionalmente a las unidades y redondear a entero
    const kilosCalculados = Math.round((resultado.totalKilos / resultado.totalUnidades) * value);
    setKilos(kilosCalculados);
    setUnidades(value);
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleSubmit = async () => {
    if (!proveedor || !fecha) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    // Validar que se haya especificado cajas o kilos/unidades
    if (!cajas && (kilos <= 0 || unidades <= 0)) {
      alert("Debe especificar la cantidad de cajas o los kilos y unidades a mover");
      return;
    }

    // Si se especificaron cajas, validar que sean válidas
    if (cajas) {
      const cajasNum = parseInt(cajas);
      if (cajasNum <= 0) {
        alert("La cantidad de cajas debe ser mayor a 0");
        return;
      }
      if (cajasNum > resultado.totalUnidades) {
        alert(`No puede sacar más cajas de las disponibles (${resultado.totalUnidades} cajas)`);
        return;
      }
    }

    if (kilos > resultado.totalKilos || unidades > resultado.totalUnidades) {
      alert("No puede sacar más mercadería de la que hay disponible");
      return;
    }

    if (kilos <= 0 || unidades <= 0) {
      alert("Los valores de kilos y unidades deben ser mayores a 0");
      return;
    }

    setLoading(true);

    try {
      // Crear los datos del remito
      const remitoData = {
        selectedItem: {
          itemId: resultado.item?.id,
          categoria: resultado.item?.categoria,
          descripcion: resultado.item?.descripcion,
          proveedor: resultado.proveedor,
          partida: resultado.partida?.numeroPartida,
          kilos: resultado.totalKilos,
          unidades: resultado.totalUnidades
        },
        kilos: parseFloat(kilos),
        unidades: parseInt(unidades),
        id: posicionActual?.id,
        proveedor: proveedor,
        fecha: fecha
      };

      console.log('Enviando remito de salida desde posición:', remitoData);

      // Llamar al endpoint
      const response = await apiClient.post('/movimientos/salida-desde-posicion', remitoData);
      
      console.log('Respuesta del servidor:', response.data);

      // Llamar a la función onSubmit que se pasa como prop
      if (onSubmit) {
        onSubmit(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al crear remito de salida:', error);
      alert(error.response?.data?.message || 'Error al crear el remito de salida');
    } finally {
      setLoading(false);
    }
  };

  // Función para validar que todos los campos estén completos
  const isFormValid = () => {
    return proveedor && fecha && (cajas || (kilos > 0 && unidades > 0));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Crear Remito de Salida desde Posición</DialogTitle>
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

            {/* Información sobre cálculo automático */}
            {resultado?.totalKilos && resultado?.totalUnidades && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'info.light', 
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="body2">
                  <strong>Cálculo automático:</strong> Si especificas la cantidad de cajas, 
                  los kilos se calcularán automáticamente. 
                  Kilos por caja: {(resultado.totalKilos / resultado.totalUnidades).toFixed(2)} kg
                </Typography>
              </Box>
            )}

            <TextField
              label="Cantidad de Cajas"
              type="number"
              value={cajas}
              onChange={handleCajasChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: resultado?.totalUnidades || 0 }}
              helperText={`Máximo disponible: ${resultado?.totalUnidades || 0} cajas`}
            />

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
              disabled={cajas !== ''} // Deshabilitar si se especificaron cajas
              inputProps={{ min: 0, max: resultado?.totalUnidades || 0 }}
              helperText={
                cajas 
                  ? `Calculado automáticamente: ${unidades} un`
                  : `Máximo disponible: ${resultado?.totalUnidades || 0} un`
              }
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
            {resultado && (
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
                  {resultado.item?.categoria} - {resultado.item?.descripcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock disponible: {resultado.totalKilos?.toFixed(2)} kg / {resultado.totalUnidades} unidades
                </Typography>
                {resultado.proveedor?.nombre && (
                  <Typography variant="body2" color="textSecondary">
                    Proveedor: {resultado.proveedor.nombre}
                  </Typography>
                )}
                {resultado.partida?.numeroPartida && (
                  <Typography variant="body2" color="textSecondary">
                    Partida: {resultado.partida.numeroPartida}
                  </Typography>
                )}
                {posicionActual && (
                  <Typography variant="body2" color="textSecondary">
                    Posición: {posicionActual.rack && posicionActual.fila && posicionActual.AB 
                      ? `${posicionActual.rack}-${posicionActual.fila}-${posicionActual.AB}`
                      : posicionActual.numeroPasillo 
                        ? `Pasillo ${posicionActual.numeroPasillo}`
                        : posicionActual.entrada 
                          ? 'Entrada'
                          : 'Posición no especificada'
                    }
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid() || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creando...' : 'Crear Remito'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
