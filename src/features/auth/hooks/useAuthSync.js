import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../model/authSlice';
import { authService } from '../../../services/authService';

export const useAuthSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sincronizar el usuario del localStorage con Redux al cargar la app
    const user = authService.getUser();
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);
};
