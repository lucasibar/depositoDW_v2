import React, { useState } from 'react';
import styles from './RemitosSalidaList.module.css';

export const RemitosSalidaList = ({ remitos }) => {
  const [expandedRemitos, setExpandedRemitos] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de remitos por página

  const getKey = (remito) => `${remito.fecha}-${remito.proveedor}`;

  const toggleRemito = (key) => {
    setExpandedRemitos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calcular el total de páginas
  const totalPages = Math.ceil(remitos.length / itemsPerPage);

  // Obtener los remitos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRemitos = remitos.slice(indexOfFirstItem, indexOfLastItem);

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Cerrar todos los remitos expandidos al cambiar de página
    setExpandedRemitos({});
  };

  // Generar array de números de página
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.container}>
      <div className={styles.remitosList}>
         {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
          
          <button 
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      {currentRemitos.map(remito => {
          const key = getKey(remito);
          return (
            <div key={key} className={styles.remito}>
              <div 
                className={styles.remitoHeader}
                onClick={() => toggleRemito(key)}
              >
                <span className={styles.fecha}>
                  {new Date(remito.fechaOriginal).toLocaleDateString()}
                </span>
                <span className={styles.proveedor}>{remito.proveedor}</span>
                <span className={styles.arrow}>
                  {expandedRemitos[key] ? '▼' : '▶'}
                </span>
              </div>
              {expandedRemitos[key] && (
                <div className={styles.items}>
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Proveedor</th>
                        <th>Descripción</th>
                        <th>Kilos</th>
                        <th>Categoría</th>
                        <th>Partida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remito.items.map(item => (
                        <tr key={item.id} className={styles.item}>
                          <td>{item.proveedor}</td>
                          <td>{item.descripcion}</td>
                          <td>{item.kilos}</td>
                          <td>{item.categoria}</td>
                          <td>{item.partida}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

     
    </div>
  );
}; 