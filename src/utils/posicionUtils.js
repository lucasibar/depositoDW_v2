export const getPosLabel = (posicion) => {
  if (!posicion) return 'Posición';
  if (posicion.rack && posicion.fila && posicion.AB) return `${posicion.rack}-${posicion.fila}-${posicion.AB}`;
  if (posicion.numeroPasillo) return `Pasillo ${posicion.numeroPasillo}`;
  if (posicion.entrada === true) return 'Entrada';
  return 'Posición';
};
