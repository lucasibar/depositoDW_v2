export const selectStock = (state) => state.stock?.stock || [];
export const selectStockByItem = (state) => state.stock?.stockByItem || [];
export const selectStockTotal = (state) => state.stock?.stockTotal || null;
export const selectStockLoading = (state) => state.stock?.isLoading || false;
export const selectStockError = (state) => state.stock?.error || null;
export const selectSelectedStock = (state) => state.stock?.selectedStock || null; 