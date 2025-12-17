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
      // Debug: Verificar estructura de los datos
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🔍 [FRONTEND] Datos antes de enviar al backend:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📦 Resultado completo:', JSON.stringify(resultado, null, 2));
      console.log('📍 Posicion actual completa:', JSON.stringify(posicionActual, null, 2));
      console.log('👤 Proveedor seleccionado (ID):', proveedor);
      console.log('⚖️ Kilos calculados:', kilos, '(tipo:', typeof kilos, ')');
      console.log('📊 Unidades calculadas:', unidades, '(tipo:', typeof unidades, ')');
      console.log('📅 Fecha:', fecha);
      console.log('📦 Cajas especificadas:', cajas);

      // Validar que todos los campos requeridos estén presentes
      if (!resultado.item?.id) {
        console.error('❌ ERROR: resultado.item.id no está definido');
        alert('Error: El item no tiene ID. Por favor, seleccione un material válido.');
        setLoading(false);
        return;
      }
      
      if (!resultado.partida?.numeroPartida) {
        console.error('❌ ERROR: resultado.partida.numeroPartida no está definido');
        alert('Error: La partida no tiene número. Por favor, seleccione un material con partida válida.');
        setLoading(false);
        return;
      }
      
      if (!posicionActual?.id) {
        console.error('❌ ERROR: posicionActual.id no está definido');
        alert('Error: La posición no tiene ID. Por favor, seleccione una posición válida.');
        setLoading(false);
        return;
      }

      // Crear los datos del remito
      const partidaId = resultado.partida?.id;
      console.log('🔍 DEBUG: partidaId extraído:', partidaId);
      console.log('🔍 DEBUG: resultado.partida completo:', resultado.partida);
      
      const remitoData = {
        selectedItem: {
          itemId: resultado.item?.id,
          categoria: resultado.item?.categoria,
          descripcion: resultado.item?.descripcion,
          proveedor: resultado.proveedor || resultado.item?.proveedor,
          partida: resultado.partida?.numeroPartida,
          partidaId: partidaId, // Enviar también el ID de la partida para evitar ambigüedad
          kilos: parseFloat(kilos),
          unidades: parseInt(unidades)
        },
        kilos: parseFloat(kilos),
        unidades: parseInt(unidades),
        id: posicionActual?.id,
        proveedor: proveedor,
        fecha: fecha
      };
      
      console.log('🔍 DEBUG: remitoData.selectedItem.partidaId:', remitoData.selectedItem.partidaId);
      
      // Validar que los valores numéricos sean válidos
      if (isNaN(remitoData.kilos) || isNaN(remitoData.unidades)) {
        console.error('❌ ERROR: kilos o unidades no son números válidos');
        console.error('   - kilos:', remitoData.kilos, '(tipo:', typeof remitoData.kilos, ')');
        console.error('   - unidades:', remitoData.unidades, '(tipo:', typeof remitoData.unidades, ')');
        alert('Error: Los valores de kilos y unidades deben ser números válidos.');
        setLoading(false);
        return;
      }

      console.log('═══════════════════════════════════════════════════════════');
      console.log('📤 [FRONTEND] Datos que se enviarán al backend:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(JSON.stringify(remitoData, null, 2));
      console.log('🔍 Detalles del selectedItem:');
      console.log('   - itemId:', remitoData.selectedItem.itemId);
      console.log('   - partida:', remitoData.selectedItem.partida);
      console.log('   - partidaId:', remitoData.selectedItem.partidaId);
      console.log('   - proveedor:', remitoData.selectedItem.proveedor);
      console.log('   - kilos:', remitoData.selectedItem.kilos);
      console.log('   - unidades:', remitoData.selectedItem.unidades);
      console.log('🔍 Detalles principales:');
      console.log('   - id (posicion):', remitoData.id);
      console.log('   - proveedor (cliente):', remitoData.proveedor);
      console.log('   - kilos:', remitoData.kilos);
      console.log('   - unidades:', remitoData.unidades);
      console.log('   - fecha:', remitoData.fecha);
      console.log('═══════════════════════════════════════════════════════════');

      // Llamar al endpoint
      console.log('🌐 [FRONTEND] Enviando petición POST a /movimientos/salida-desde-posicion');
      const response = await apiClient.post('/movimientos/salida-desde-posicion', remitoData);
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log('✅ [FRONTEND] Respuesta del servidor recibida:');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('═══════════════════════════════════════════════════════════');

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
