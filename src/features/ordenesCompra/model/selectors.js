export const selectOrdenesCompra = (state) => state.ordenesCompra?.ordenesCompra || [];
export const selectOrdenesCompraLoading = (state) => state.ordenesCompra?.isLoading || false;
export const selectOrdenesCompraError = (state) => state.ordenesCompra?.error || null;
export const selectSelectedOrden = (state) => state.ordenesCompra?.selectedOrden || null; 