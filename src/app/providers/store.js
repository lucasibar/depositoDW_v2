import { configureStore } from '@reduxjs/toolkit';
import { authService } from '../../services/auth/authService';

export const store = configureStore({
  reducer: {
  authService
  },
}); 