export const selectRemitos = (state) => state.remitos?.remitos || [];
export const selectRemitosLoading = (state) => state.remitos?.isLoading || false;
export const selectRemitosError = (state) => state.remitos?.error || null;
export const selectSelectedRemito = (state) => state.remitos?.selectedRemito || null; 