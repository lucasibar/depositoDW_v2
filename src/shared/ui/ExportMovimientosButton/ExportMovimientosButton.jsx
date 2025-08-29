import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { stockApi } from '../../../features/stock/api/stockApi';
import styles from './ExportMovimientosButton.module.css';

export const ExportMovimientosButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      const movimientos = await stockApi.getAllMovimientos();
      
      if (!movimientos || movimientos.length === 0) {
        alert('No hay movimientos para exportar');
        return;
      }

      // Extraer los grupos consolidados con totales calculados
      const movimientosConsolidados = [];
      
      movimientos.forEach(grupo => {
        movimientosConsolidados.push({
          'Descripción': grupo.item?.descripcion || '',
          'Categoría': grupo.item?.categoria || '',
          'Número de Partida': grupo.partida?.numeroPartida || '',
          'Proveedor': grupo.proveedor || 'Sin proveedor',
          'Rack': grupo.posicion?.rack || '',
          'Fila': grupo.posicion?.fila || '',
          'Nivel AB': grupo.posicion?.AB || '',
          'Pasillo': grupo.posicion?.numeroPasillo || '',
          'Total Kilos': Number(grupo.kilos || 0).toFixed(2),
          'Total Unidades': Number(grupo.unidades || 0).toFixed(2),
          'Suma Kilos': Number(grupo.sumaKilos || 0).toFixed(2),
          'Suma Unidades': Number(grupo.sumaUnidades || 0).toFixed(2),
          'Resta Kilos': Number(grupo.restaKilos || 0).toFixed(2),
          'Resta Unidades': Number(grupo.restaUnidades || 0).toFixed(2),
          'Cantidad de Movimientos': grupo.movimientos?.length || 0
        });
      });

      // Crear el libro de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(movimientosConsolidados);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 40 },  // Descripción
        { wch: 20 },  // Categoría
        { wch: 20 },  // Número de Partida
        { wch: 30 },  // Proveedor
        { wch: 10 },  // Rack
        { wch: 10 },  // Fila
        { wch: 12 },  // Nivel AB
        { wch: 12 },  // Pasillo
        { wch: 15 },  // Total Kilos
        { wch: 15 },  // Total Unidades
        { wch: 15 },  // Suma Kilos
        { wch: 15 },  // Suma Unidades
        { wch: 15 },  // Resta Kilos
        { wch: 15 },  // Resta Unidades
        { wch: 20 }   // Cantidad de Movimientos
      ];
      
      worksheet['!cols'] = columnWidths;

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos Consolidados');

      // Generar y descargar el archivo
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const fecha = new Date().toISOString().split('T')[0];
      const filename = `Movimientos_Consolidados_${fecha}.xlsx`;
      saveAs(data, filename);

      alert(`✅ Excel descargado: ${filename}\n\n📊 Total de grupos consolidados: ${movimientosConsolidados.length}`);

    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<TimelineIcon />}
      onClick={handleExport}
      disabled={isLoading}
      className={styles.exportButton}
    >
      {isLoading ? 'Generando...' : 'Exportar Movimientos Consolidados'}
    </Button>
  );
};
