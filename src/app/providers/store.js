import { configureStore } from '@reduxjs/toolkit';
import stockReducer from '../../features/stock/slice';

export const store = configureStore({
  reducer: {
    stock: stockReducer,
  },
}); 