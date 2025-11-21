import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getPosLabel } from '../../../utils/posicionUtils';
import {
  EXCEL_COLUMN_WIDTHS,
  EXCEL_SHEET_NAME,
  EXCEL_FILE_BASENAME
} from '../constants/stockPageConstants';

export const buildExcelRowsFromStock = (stockData = [], exportDate) => {
  const rows = [];
  const exportDateString = exportDate.toLocaleDateString('es-ES');
  const exportTimeString = exportDate.toLocaleTimeString('es-ES');

  stockData.forEach((posicion) => {
    const items = posicion.items || [];

    items.forEach((itemWrapper) => {
      const partidas = itemWrapper.partidas || [];

      partidas.forEach((partida) => {
        const rowNumber = rows.length + 1;

        rows.push({
          'Nº': rowNumber,
          'Item (Categoría - Descripción)': `${itemWrapper.item?.categoria || ''} - ${itemWrapper.item?.descripcion || ''}`,
          'Número de Partida': partida.numeroPartida || '',
          'Proveedor': itemWrapper.item?.proveedor?.nombre || '',
          'Posición': getPosLabel(posicion.posicion),
          'Kilos': Number(partida.kilos || 0).toFixed(2),
          'Unidades': Number(partida.unidades || 0),
          'Fecha Exportación': exportDateString,
          'Hora Exportación': exportTimeString
        });
      });
    });
  });

  return rows;
};

export const buildReportMetadata = (rows, exportDate) => {
  const totalKilos = rows
    .reduce((sum, row) => sum + parseFloat(row['Kilos'] || 0), 0)
    .toFixed(2);

  const totalUnidades = rows.reduce(
    (sum, row) => sum + Number(row['Unidades'] || 0),
    0
  );

  return [
    ['REPORTE DE STOCK CONSOLIDADO'],
    [''],
    [`Fecha de generación: ${exportDate.toLocaleDateString('es-ES')}`],
    [`Hora de generación: ${exportDate.toLocaleTimeString('es-ES')}`],
    [`Total de registros: ${rows.length}`],
    [''],
    ['RESUMEN:'],
    [`- Items con stock: ${rows.length}`],
    [`- Total kilos: ${totalKilos}`],
    [`- Total unidades: ${totalUnidades}`],
    [''],
    ['NOTA: Este reporte muestra el stock consolidado por partida, item y posición.'],
    ['Los kilos se calculan sumando entradas y restando salidas según el tipo de movimiento.'],
    ['']
  ];
};

export const createWorkbookFromRows = (rows, metadata) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = EXCEL_COLUMN_WIDTHS;
  XLSX.utils.sheet_add_aoa(worksheet, metadata, { origin: 'A1' });
  XLSX.utils.book_append_sheet(workbook, worksheet, EXCEL_SHEET_NAME);

  return workbook;
};

export const saveWorkbook = (workbook, filename) => {
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, filename);
};

export const generateReportFilename = (baseName) => {
  const date = new Date().toISOString().split('T')[0];
  return `${baseName}_${date}.xlsx`;
};

