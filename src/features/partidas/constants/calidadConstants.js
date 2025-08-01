export const PARTIDA_ESTADOS = {
  CUARENTENA: 'cuarentena',
  CUARENTENA_UPPER: 'CUARENTENA',
  APROBADA: 'cuarentena-aprobada',
  APROBADO: 'APROBADO',
  RECHAZADA: 'rechazada'
};

export const SNACKBAR_MESSAGES = {
  PARTIDA_APROBADA: 'Partida aprobada exitosamente',
  PARTIDA_RECHAZADA: 'Partida rechazada exitosamente',
  PARTIDA_DEVUELTA: 'Partida devuelta a cuarentena',
  ERROR_APROBAR: 'Error al aprobar la partida',
  ERROR_RECHAZAR: 'Error al rechazar la partida',
  ERROR_DEVOLVER: 'Error al devolver la partida a cuarentena'
};

export const EMPTY_STATE_MESSAGES = {
  CUARENTENA: {
    title: 'No hay partidas en cuarentena',
    description: 'Las partidas que requieran revisión de calidad aparecerán aquí'
  },
  APROBADAS: {
    title: 'No hay partidas aprobadas',
    description: 'Las partidas que apruebes desde cuarentena aparecerán aquí'
  }
}; 