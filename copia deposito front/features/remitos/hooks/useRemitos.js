import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRemitosEntrada } from "../model/slice";
import { selectRemitos, selectRemitosLoading, selectRemitosError } from "../model/selectors";

export const useRemitos = () => {
  const dispatch = useDispatch();
  const remitos = useSelector(selectRemitos);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);

  useEffect(() => {
    dispatch(fetchRemitosEntrada());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchRemitosEntrada());
  };

  return {
    remitos,
    isLoading,
    error,
    handleRetry
  };
}; 