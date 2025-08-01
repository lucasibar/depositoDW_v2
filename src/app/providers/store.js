import { configureStore } from '@reduxjs/toolkit';
import comprasReducer from '../../features/compras/model/slice';
import stockReducer from '../../features/stock/model/slice';
import remitosReducer from '../../features/remitos/model/slice';
import ordenesCompraReducer from '../../features/ordenesCompra/model/slice';
import presupuestoReducer from '../../features/presupuesto/model/slice';
import partidasReducer from '../../features/partidas/model/slice';

export const store = configureStore({
  reducer: {
    compras: comprasReducer,
    stock: stockReducer,
    remitos: remitosReducer,
    ordenesCompra: ordenesCompraReducer,
    presupuesto: presupuestoReducer,
    partidas: partidasReducer,
  },
}); 