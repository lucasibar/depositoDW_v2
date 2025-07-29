export const selectItems = (state) => state.compras?.items || [];
export const selectProveedores = (state) => state.compras?.proveedores || [];
export const selectComprasLoading = (state) => state.compras?.isLoading || false;
export const selectComprasError = (state) => state.compras?.error || null;
export const selectSelectedItem = (state) => state.compras?.selectedItem || null;
export const selectSelectedProveedor = (state) => state.compras?.selectedProveedor || null; 