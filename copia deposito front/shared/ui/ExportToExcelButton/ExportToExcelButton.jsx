import React from 'react';
import { Button } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './ExportToExcelButton.module.css';

export const ExportToExcelButton = ({ 
  data, 
  filename = 'export', 
  sheetName = 'Datos',
  disabled = false 
}) => {
  const handleExport = () => {
    try {
      // Preparar los datos para Excel
      const excelData = data.map((item, index) => ({
        'Nº': index + 1,
        'ID Item': item.item?.id || '',
        'Descripción': item.item?.descripcion || '',
        'Categoría': item.item?.categoria || '',
        'ID Partida': item.partida?.id || '',
        'Número de Partida': item.partida?.numeroPartida || '',
        'Proveedor': item.proveedor || '',
        'Kilos': Number(item.kilos || 0).toFixed(2),
        'Unidades': Number(item.unidades || 0),
        'Stock Total (Kilos)': Number(item.kilos || 0).toFixed(2),
        'Stock Total (Unidades)': Number(item.unidades || 0),
        'Fecha Exportación': new Date().toLocaleDateString('es-ES'),
        'Hora Exportación': new Date().toLocaleTimeString('es-ES')
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 5 },  // Nº
        { wch: 10 }, // ID Item
        { wch: 50 }, // Descripción
        { wch: 20 }, // Categoría
        { wch: 10 }, // ID Partida
        { wch: 15 }, // Número de Partida
        { wch: 30 }, // Proveedor
        { wch: 12 }, // Kilos
        { wch: 12 }, // Unidades
        { wch: 18 }, // Stock Total (Kilos)
        { wch: 20 }, // Stock Total (Unidades)
        { wch: 15 }, // Fecha Exportación
        { wch: 15 }  // Hora Exportación
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
        [`- Total kilos: ${excelData.reduce((sum, item) => sum + parseFloat(item['Stock Total (Kilos)']), 0).toFixed(2)}`],
        [`- Total unidades: ${excelData.reduce((sum, item) => sum + parseInt(item['Stock Total (Unidades)']), 0)}`],
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

      console.log(`✅ Archivo Excel exportado: ${finalFilename} con ${excelData.length} registros`);
      
      // Mostrar mensaje de éxito
      alert(`✅ Archivo Excel exportado exitosamente:\n${finalFilename}\n\nTotal de registros: ${excelData.length}`);
    } catch (error) {
      console.error('❌ Error al exportar a Excel:', error);
      alert('❌ Error al exportar el archivo Excel. Por favor, inténtalo de nuevo.');
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
      Exportar a Excel ({data?.length || 0})
    </Button>
  );
};
