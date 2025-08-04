export const SALIDA_ESTADOS = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

export const REMITO_ESTADOS = {
  EN_TRANSITO: 'en_transito',
  ENTREGADO: 'entregado',
  PENDIENTE_ENTREGA: 'pendiente_entrega',
  CANCELADO: 'cancelado'
};

export const SALIDA_ESTADOS_LABELS = {
  [SALIDA_ESTADOS.PENDIENTE]: 'Pendiente',
  [SALIDA_ESTADOS.APROBADA]: 'Aprobada',
  [SALIDA_ESTADOS.RECHAZADA]: 'Rechazada',
  [SALIDA_ESTADOS.COMPLETADA]: 'Completada',
  [SALIDA_ESTADOS.CANCELADA]: 'Cancelada'
};

export const REMITO_ESTADOS_LABELS = {
  [REMITO_ESTADOS.EN_TRANSITO]: 'En Tránsito',
  [REMITO_ESTADOS.ENTREGADO]: 'Entregado',
  [REMITO_ESTADOS.PENDIENTE_ENTREGA]: 'Pendiente de Entrega',
  [REMITO_ESTADOS.CANCELADO]: 'Cancelado'
};

export const SALIDA_ESTADOS_COLORS = {
  [SALIDA_ESTADOS.PENDIENTE]: 'warning',
  [SALIDA_ESTADOS.APROBADA]: 'success',
  [SALIDA_ESTADOS.RECHAZADA]: 'error',
  [SALIDA_ESTADOS.COMPLETADA]: 'info',
  [SALIDA_ESTADOS.CANCELADA]: 'default'
};

export const REMITO_ESTADOS_COLORS = {
  [REMITO_ESTADOS.EN_TRANSITO]: 'warning',
  [REMITO_ESTADOS.ENTREGADO]: 'success',
  [REMITO_ESTADOS.PENDIENTE_ENTREGA]: 'info',
  [REMITO_ESTADOS.CANCELADO]: 'error'
};

export const SNACKBAR_MESSAGES = {
  SALIDA_CREADA: 'Salida creada exitosamente',
  SALIDA_APROBADA: 'Salida aprobada exitosamente',
  SALIDA_RECHAZADA: 'Salida rechazada',
  SALIDA_COMPLETADA: 'Salida completada exitosamente',
  REMITO_CREADO: 'Remito creado exitosamente',
  REMITO_ENTREGADO: 'Remito marcado como entregado',
  ERROR_CREAR_SALIDA: 'Error al crear la salida',
  ERROR_APROBAR_SALIDA: 'Error al aprobar la salida',
  ERROR_RECHAZAR_SALIDA: 'Error al rechazar la salida',
  ERROR_COMPLETAR_SALIDA: 'Error al completar la salida',
  ERROR_CREAR_REMITO: 'Error al crear el remito',
  ERROR_ENTREGAR_REMITO: 'Error al marcar remito como entregado'
};

export const EMPTY_STATE_MESSAGES = {
  PENDIENTES: {
    title: 'No hay salidas pendientes',
    description: 'No hay solicitudes de salida pendientes de aprobación'
  },
  HISTORIAL: {
    title: 'No hay historial de salidas',
    description: 'No se encontraron registros de salidas en el historial'
  },
  REMITOS: {
    title: 'No hay remitos de salida',
    description: 'No se encontraron remitos de salida registrados'
  }
};

export const SEARCH_PLACEHOLDERS = {
  SALIDA: "Buscar por número de salida, material, solicitante o destino...",
  REMITO: "Buscar por número de remito, transportista, destino o estado..."
}; 