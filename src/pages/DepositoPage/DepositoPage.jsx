import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import styles from './StockPage.module.css';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { PosicionesList } from '../../widgets/stock/PosicionesList/PosicionesList';
import { fetchPosiciones } from '../../features/posicion/model/slice';
import { usePosicionFilter } from '../../features/posicion/hooks/usePosicionFilter';
import { Title } from '../../shared/ui/Title/Title';
import { ChartCarousel } from '../../widgets/charts/ChartCarousel/ChartCarousel';

export const DepositoPage = () => {
  const dispatch = useDispatch();
  const [searchTerms, setSearchTerms] = useState([]);
  const { filteredData, loading, error } = usePosicionFilter(searchTerms);

  useEffect(() => {
    dispatch(fetchPosiciones());
  }, [dispatch]);

  const handleSearch = (terms) => {
    setSearchTerms(terms);
  };

  const exportToExcel = () => {
    // Transform the data for Excel
    const excelData = filteredData.flatMap(posicion => 
      posicion.items.map(item => ({
        Proveedor: item.proveedor?.nombre || '',
        Descripcion: item.descripcion || '',
        Categoria: item.categoria || '',
        Partida: item.partida || '',
        'Estado Partida': item.partidaEstado || '',
        Kilos: item.kilos || 0,
        Unidades: item.unidades || 0,
        Fila: posicion.fila || '',
        Rack: posicion.rack || '',
        AB: posicion.AB || '',
        Pasillo: posicion.pasillo || '',
        Entrada: posicion.entrada ? 'Sí' : 'No'
      }))
    );

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Posiciones");
    
    // Generate & Download Excel file
    XLSX.writeFile(wb, "posiciones.xlsx");
  };

  return (
    <div className={styles.container}>
      <Title>Deposito</Title>
      <div className={styles.mainContent}>
        <div className={styles.listContainer}>
          <PosicionesList posiciones={filteredData} loading={loading} error={error} />
        </div>
        <div className={styles.chartContainer}>
          <ChartCarousel posiciones={filteredData} />
        </div>
      </div>
    </div>
  );
}; 