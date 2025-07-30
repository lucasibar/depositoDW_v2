export const selectStock = (state) => state.stock.stock;
export const selectStockLoading = (state) => state.stock.isLoading;
export const selectStockError = (state) => state.stock.error;
export const selectStockByMaterial = (state) => state.stock.stockByMaterial;
export const selectStockTotal = (state) => state.stock.stockTotal;
export const selectSelectedStock = (state) => state.stock.selectedStock;
export const selectPosiciones = (state) => state.stock.posiciones; 