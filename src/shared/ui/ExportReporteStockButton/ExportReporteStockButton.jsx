import React from 'react';
import { Button } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './ExportReporteStockButton.module.css';

export const ExportReporteStockButton = ({ 
  data, 
  filename = 'reporte-stock-consolidado', 
  sheetName = 'Stock Consolidado',
  disabled = false 
}) => {
  const handleExport = () => {
    try {
      // Preparar los datos para Excel con el formato específico del reporte
      const excelData = data.map((item, index) => ({
        'Nº': index + 1,
        'Item (Categoría - Descripción)': item.itemDescripcion || '',
        'Número de Partida': item.numeroPartida || '',
        'Proveedor': item.proveedor || '',
        'Posición': item.posicion || '',
        'Kilos': Number(item.kilos || 0).toFixed(2),
        'Unidades': Number(item.unidades || 0),
        'Fecha Exportación': new Date().toLocaleDateString('es-ES'),
        'Hora Exportación': new Date().toLocaleTimeString('es-ES')
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 5 },   // Nº
        { wch: 60 },  // Item (Categoría - Descripción)
        { wch: 20 },  // Número de Partida
        { wch: 30 },  // Proveedor
        { wch: 40 },  // Posición
        { wch: 12 },  // Kilos
        { wch: 12 },  // Unidades
        { wch: 15 },  // Fecha Exportación
        { wch: 15 }   // Hora Exportación
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar información del reporte
      const reportInfo = [
        ['REPORTE DE STOCK CONSOLIDADO'],
        [''],
        [`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`],
        [`Hora de generación: ${new Date().toLocaleTimeString('es-ES')}`],
        [`Total de registros: ${excelData.length}`],
        [''],
        ['RESUMEN:'],
        [`- Items con stock: ${excelData.length}`],
        [`- Total kilos: ${excelData.reduce((sum, item) => sum + parseFloat(item['Kilos']), 0).toFixed(2)}`],
        [`- Total unidades: ${excelData.reduce((sum, item) => sum + parseInt(item['Unidades']), 0)}`],
        [''],
        ['NOTA: Este reporte muestra el stock consolidado por partida, item y posición.'],
        ['Los kilos se calculan sumando entradas y restando salidas según el tipo de movimiento.'],
        ['']
      ];

      // Agregar la información del reporte al inicio
      XLSX.utils.sheet_add_aoa(worksheet, reportInfo, { origin: 'A1' });

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generar el archivo
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });

      // Crear el blob y descargar
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Agregar fecha al nombre del archivo
      const date = new Date().toISOString().split('T')[0];
      const finalFilename = `${filename}_${date}.xlsx`;
      
      saveAs(blob, finalFilename);

      console.log(`✅ Reporte de stock exportado: ${finalFilename} con ${excelData.length} registros`);
      
      // Mostrar mensaje de éxito
      alert(`✅ Reporte de stock exportado exitosamente:\n${finalFilename}\n\nTotal de registros: ${excelData.length}\nTotal kilos: ${excelData.reduce((sum, item) => sum + parseFloat(item['Kilos']), 0).toFixed(2)}`);
    } catch (error) {
      console.error('❌ Error al exportar reporte de stock:', error);
      alert('❌ Error al exportar el reporte de stock. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<FileDownloadIcon />}
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={styles.exportButton}
      sx={{
        backgroundColor: 'var(--color-primary)',
        '&:hover': {
          backgroundColor: 'var(--color-primary-dark)',
        },
        '&:disabled': {
          backgroundColor: 'var(--color-disabled)',
          color: 'var(--color-text-disabled)',
        }
      }}
    >
      Exportar Reporte Stock ({data?.length || 0})
    </Button>
  );
};
