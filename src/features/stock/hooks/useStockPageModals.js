import { useCallback, useState } from 'react';

export const useStockPageModals = () => {
  const initialSelection = { item: null, partida: null, posicion: null };
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selection, setSelection] = useState(initialSelection);
  const [modalPayload, setModalPayload] = useState(null);
  const [movimientoInternoOpen, setMovimientoInternoOpen] = useState(false);
  const [modalAjusteOpen, setModalAjusteOpen] = useState(false);
  const [modalRemitoOpen, setModalRemitoOpen] = useState(false);
  const [modalAdicionOpen, setModalAdicionOpen] = useState(false);

  const resetSelection = useCallback(() => {
    setSelection(initialSelection);
    setModalPayload(null);
  }, []);

  const openMenu = useCallback((event, item, partida, posicion) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelection({ item, partida, posicion });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const openMovimiento = useCallback(
    (payload) => {
      setModalPayload(payload);
      setMovimientoInternoOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const closeMovimiento = useCallback(() => {
    setMovimientoInternoOpen(false);
    resetSelection();
  }, [resetSelection]);

  const openAjuste = useCallback(
    (payload) => {
      setModalPayload(payload);
      setModalAjusteOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const closeAjuste = useCallback(() => {
    setModalAjusteOpen(false);
    resetSelection();
  }, [resetSelection]);

  const openRemito = useCallback(
    (payload) => {
      setModalPayload(payload);
      setModalRemitoOpen(true);
      closeMenu();
    },
    [closeMenu]
  );

  const closeRemito = useCallback(() => {
    setModalRemitoOpen(false);
    resetSelection();
  }, [resetSelection]);

  const openAdicionRapida = useCallback((posicion) => {
    setSelection((prev) => ({ ...prev, posicion }));
    setModalPayload(null);
    setModalAdicionOpen(true);
  }, []);

  const closeAdicionRapida = useCallback(() => {
    setModalAdicionOpen(false);
    resetSelection();
  }, [resetSelection]);

  return {
    menuAnchor,
    selection,
    modalPayload,
    movimientoInternoOpen,
    modalAjusteOpen,
    modalRemitoOpen,
    modalAdicionOpen,
    openMenu,
    closeMenu,
    openMovimiento,
    closeMovimiento,
    openAjuste,
    closeAjuste,
    openRemito,
    closeRemito,
    openAdicionRapida,
    closeAdicionRapida
  };
};

