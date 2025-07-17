import { configureStore } from '@reduxjs/toolkit';
import hiladoReducer from '../../features/hilado/model/slice';
import posicionesReducer from '../../features/posicion/model/slice';
import remitosReducer from '../../features/remitos/model/slice';
import historialReducer from '../../features/historial/model/slice';
import cuarentenaReducer from '../../features/cuarentena/model/slice';
import partidasReducer from '../../features/partidas/model/slice';
import movimientosReducer from '../../features/movimientos/model/slice';
import produccionReducer from '../../features/produccion/model/slice';
import ordenPedidoReducer from '../../features/orden-pedido/model/slice';
import articulosReducer from '../../pages/articulos/model/slice/articulosSlice';
import planProduccionReducer from '../../pages/plan-produccion/model/slice/planProduccionSlice';
import movimientosArticulosReducer from '../../features/movimientos_articulos/model/slice';

export const store = configureStore({
  reducer: {
    hilado: hiladoReducer,
    posiciones: posicionesReducer,
    remitos: remitosReducer,
    historial: historialReducer,
    cuarentena: cuarentenaReducer,
    partidas: partidasReducer,  
    movimientos: movimientosReducer,
    produccion: produccionReducer,
    ordenPedido: ordenPedidoReducer,
    articulos: articulosReducer,
    planProduccion: planProduccionReducer,
    movimientosArticulos: movimientosArticulosReducer,
  },
}); 