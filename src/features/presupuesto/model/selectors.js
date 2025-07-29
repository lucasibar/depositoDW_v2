export const selectPresupuesto = (state) => state.presupuesto?.presupuesto || [];
export const selectPresupuestoLoading = (state) => state.presupuesto?.isLoading || false;
export const selectPresupuestoError = (state) => state.presupuesto?.error || null;
export const selectSelectedPresupuesto = (state) => state.presupuesto?.selectedPresupuesto || null; 