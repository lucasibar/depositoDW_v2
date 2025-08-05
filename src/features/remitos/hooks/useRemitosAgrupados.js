import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRemitosEntradaAgrupados, deleteMovimientoRemito } from "../model/slice";
import { selectRemitos, selectRemitosLoading, selectRemitosError } from "../model/selectors";

export const useRemitosAgrupados = () => {
  const dispatch = useDispatch();
  const remitos = useSelector(selectRemitos);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);

  useEffect(() => {
    dispatch(fetchRemitosEntradaAgrupados());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchRemitosEntradaAgrupados());
  };

  const handleDeleteMovimiento = async (movimientoId) => {
    try {
      await dispatch(deleteMovimientoRemito(movimientoId)).unwrap();
      // Recargar los remitos después de eliminar
      dispatch(fetchRemitosEntradaAgrupados());
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Error al eliminar el movimiento' };
    }
  };

  return {
    remitos,
    isLoading,
    error,
    handleRetry,
    handleDeleteMovimiento
  };
}; 