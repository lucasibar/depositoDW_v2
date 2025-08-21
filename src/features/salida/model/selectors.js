// Selectores para el slice de salida
export const selectSalidaRegistros = (state) => state.salida.registros;
export const selectSalidaProveedores = (state) => state.salida.proveedores;
export const selectSalidaClientes = (state) => state.salida.clientes;
export const selectSalidaItems = (state) => state.salida.items;
export const selectSalidaLoading = (state) => state.salida.loading;
export const selectSalidaError = (state) => state.salida.error;

// Selectores derivados
export const selectSalidaRegistrosCount = (state) => state.salida.registros.length;
export const selectSalidaProveedoresCount = (state) => state.salida.proveedores.length;
export const selectSalidaClientesCount = (state) => state.salida.clientes.length;
