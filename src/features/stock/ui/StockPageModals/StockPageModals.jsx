import React from 'react';
import MovimientoInterno from '../../../../components/MovimientoInterno/MovimientoInterno';
import AjustePosicionModal from '../AjustePosicionModal';
import RemitoSalidaDesdePosicionModal from '../../../salida/ui/RemitoSalidaDesdePosicionModal/RemitoSalidaDesdePosicionModal';
import { AdicionRapidaPosicion } from '../../../../components/AdicionRapidaPosicion';

const StockPageModals = ({
  modals,
  onMovimientoCompletado,
  onAjusteExitoso,
  onRemitoExitoso,
  onAdicionSubmit
}) => (
  <>
    <MovimientoInterno
      open={modals.movimientoInternoOpen}
      onClose={modals.closeMovimiento}
      itemSeleccionado={modals.modalPayload}
      posicionOrigen={modals.selection.posicion}
      onMovimientoCompletado={onMovimientoCompletado}
    />

    <AjustePosicionModal
      open={modals.modalAjusteOpen}
      onClose={modals.closeAjuste}
      material={modals.modalPayload}
      onAjusteExitoso={onAjusteExitoso}
    />

    <RemitoSalidaDesdePosicionModal
      open={modals.modalRemitoOpen}
      onClose={modals.closeRemito}
      resultado={modals.modalPayload}
      posicionActual={modals.selection.posicion}
      onSubmit={onRemitoExitoso}
    />

    <AdicionRapidaPosicion
      open={modals.modalAdicionOpen}
      onClose={modals.closeAdicionRapida}
      posicion={modals.selection.posicion}
      onSubmit={onAdicionSubmit}
    />
  </>
);

export default StockPageModals;

