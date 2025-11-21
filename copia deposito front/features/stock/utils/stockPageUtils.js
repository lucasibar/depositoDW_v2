import { getPosLabel } from '../../../utils/posicionUtils';

export const hasValidSelection = (selection) =>
  Boolean(selection.item && selection.partida && selection.posicion);

export const buildAdjustmentPayload = (selection) => ({
  item: selection.item,
  partida: selection.partida,
  posicion: selection.posicion,
  totalKilos: selection.partida?.kilos,
  totalUnidades: selection.partida?.unidades
});

export const buildMovementPayload = (selection) => ({
  item: selection.item,
  partida: selection.partida,
  totalKilos: selection.partida?.kilos,
  totalUnidades: selection.partida?.unidades
});

export const generateReportFilename = (baseName) => {
  const date = new Date().toISOString().split('T')[0];
  return `${baseName}_${date}.xlsx`;
};

export const buildCombinedItemText = (itemWrapper) => {
  const texts = [
    itemWrapper.item?.categoria || '',
    itemWrapper.item?.descripcion || '',
    itemWrapper.item?.proveedor?.nombre || ''
  ];

  (itemWrapper.partidas || []).forEach((partida) => {
    texts.push(partida.numeroPartida || '');
  });

  return texts.join(' ').toLowerCase();
};

export const splitSearchTerms = (searchTerm) =>
  searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);

export const isRackTerm = (term) => {
  if (!term.includes('-')) return false;
  const parts = term.split('-');
  if (parts.length !== 2) return false;
  const [rackStr, filaStr] = parts;
  const rack = parseInt(rackStr, 10);
  const fila = parseInt(filaStr, 10);
  return !Number.isNaN(rack) && !Number.isNaN(fila);
};

export const matchesRackTerm = (posicion, term) => {
  if (!isRackTerm(term)) return false;
  const [rackStr, filaStr] = term.split('-');
  const rack = parseInt(rackStr, 10);
  const fila = parseInt(filaStr, 10);
  return posicion?.rack === rack && posicion?.fila === fila;
};

export const matchesPasilloTerm = (posicion, term, posLabel) => {
  if (term === 'pasillo') {
    return posLabel.includes('pasillo');
  }

  if (!term.startsWith('pasillo')) {
    return false;
  }

  const parts = term.split(' ');
  if (parts.length === 2) {
    const pasilloNum = parseInt(parts[1], 10);
    if (!Number.isNaN(pasilloNum)) {
      return posicion?.numeroPasillo === pasilloNum;
    }
  }

  return posLabel.includes(term);
};

export const itemMatchesAllTerms = (itemWrapper, searchTerms, posicion, posLabel) => {
  const combinedItemText = buildCombinedItemText(itemWrapper);

  return searchTerms.every((term) => {
    if (isRackTerm(term)) {
      return matchesRackTerm(posicion, term) || posLabel.includes(term);
    }

    if (matchesPasilloTerm(posicion, term, posLabel)) {
      return true;
    }

    return combinedItemText.includes(term);
  });
};

export const filterStockPositions = (positions = [], searchTerm = '') => {
  if (!searchTerm.trim()) {
    return positions;
  }

  const searchTerms = splitSearchTerms(searchTerm);

  return positions.filter((position) => {
    const posLabel = getPosLabel(position.posicion).toLowerCase();

    const positionMatches = searchTerms.every((term) => {
      if (isRackTerm(term)) {
        return matchesRackTerm(position.posicion, term) || posLabel.includes(term);
      }

      if (matchesPasilloTerm(position.posicion, term, posLabel)) {
        return true;
      }

      return posLabel.includes(term);
    });

    if (positionMatches) {
      return true;
    }

    return (position.items || []).some((itemWrapper) =>
      itemMatchesAllTerms(itemWrapper, searchTerms, position.posicion, posLabel)
    );
  });
};

export const itemMatchesSearchTerm = (itemWrapper, searchTerm) => {
  if (!searchTerm.trim()) {
    return false;
  }

  const searchTerms = splitSearchTerms(searchTerm);
  const itemTerms = searchTerms.filter(
    (term) => !isRackTerm(term) && !term.startsWith('pasillo')
  );

  if (itemTerms.length === 0) {
    return false;
  }

  const combinedItemText = buildCombinedItemText(itemWrapper);
  return itemTerms.every((term) => combinedItemText.includes(term));
};

