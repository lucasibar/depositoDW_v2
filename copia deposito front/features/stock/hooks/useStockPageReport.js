import { useCallback, useState } from 'react';
import { stockApi } from '../api/stockApi';
import {
  buildExcelRowsFromStock,
  buildReportMetadata,
  createWorkbookFromRows,
  saveWorkbook,
  generateReportFilename
} from '../utils/excelExportUtils';
import { EXCEL_FILE_BASENAME } from '../constants/stockPageConstants';

export const useStockPageReport = (showNotification) => {
  const [loadingReporte, setLoadingReporte] = useState(false);

  const exportStockReport = useCallback(async () => {
    try {
      setLoadingReporte(true);
      const stockData = await stockApi.getConsultaRapidaAgrupado();

      if (!Array.isArray(stockData) || stockData.length === 0) {
        showNotification('No hay datos para exportar', 'warning');
        return;
      }

      const exportDate = new Date();
      const rows = buildExcelRowsFromStock(stockData, exportDate);
      const metadata = buildReportMetadata(rows, exportDate);
      const workbook = createWorkbookFromRows(rows, metadata);
      const filename = generateReportFilename(EXCEL_FILE_BASENAME);

      saveWorkbook(workbook, filename);
      showNotification(
        `Reporte de stock exportado exitosamente: ${filename} (${rows.length} registros)`,
        'success'
      );
    } catch (error) {
      console.error('Error al exportar reporte de stock:', error);
      showNotification('Error al exportar el reporte de stock', 'error');
    } finally {
      setLoadingReporte(false);
    }
  }, [showNotification]);

  return { loadingReporte, exportStockReport };
};

