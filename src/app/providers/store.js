import { configureStore } from '@reduxjs/toolkit';
import notificacionesReducer from '../../features/notificaciones/model/notificacionesSlice';
import stockReducer from '../../features/stock/model/slice';
import comprasReducer from '../../features/compras/model/slice';
import remitosReducer from '../../features/remitos/model/slice';
import ordenesCompraReducer from '../../features/ordenesCompra/model/slice';
import presupuestoReducer from '../../features/presupuesto/model/slice';
import partidasReducer from '../../features/partidas/model/slice';
import historialReducer from '../../features/salida/model/historialSlice';
import adicionesRapidasReducer from '../../features/adicionesRapidas/model/slice';
import salidaReducer from '../../features/salida/model/salidaSlice';

export const store = configureStore({
  reducer: {
    notificaciones: notificacionesReducer,
    stock: stockReducer,
    compras: comprasReducer,
    remitos: remitosReducer,
    ordenesCompra: ordenesCompraReducer,
    presupuesto: presupuestoReducer,
    partidas: partidasReducer,
    historial: historialReducer,
    adicionesRapidas: adicionesRapidasReducer,
    salida: salidaReducer,
  },
}); 