import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovimientosConsultaRapida } from '../../features/stock/slice';

export const ListadoStock = ({
  title = 'Listado de stock',
  titleStyle,
  containerStyle,
  children,
}) => {
  const dispatch = useDispatch();
  const { stock, isLoading, error } = useSelector((state) => state.stock);
  
  const [filters, setFilters] = useState({
    posicion: '',
    descripcion: '',
    categoria: '',
    numeroPartida: '',
    proveedor: '',
    kilos: '',
    unidades: '',
  });

  useEffect(() => {
    dispatch(fetchMovimientosConsultaRapida());
  }, [dispatch]);

  // Aplanar la estructura: posición -> items -> partidas
  const flattenedStock = useMemo(() => {
    if (!stock || stock.length === 0) return [];
    
    const flatItems = [];
    
    stock.forEach((posicionData) => {
      const posicion = posicionData.posicion || {};
      const items = posicionData.items || [];
      
      // Construir identificador de posición
      const posicionStr = [
        posicion.rack,
        posicion.fila,
        posicion.AB,
        posicion.numeroPasillo
      ].filter(Boolean).join('-') || 'Sin posición';
      
      items.forEach((itemData) => {
        const item = itemData.item || {};
        const partidas = itemData.partidas || [];
        
        partidas.forEach((partida) => {
          flatItems.push({
            posicion: posicionStr,
            posicionDetalle: posicion,
            descripcion: item.descripcion || 'Sin descripción',
            categoria: item.categoria || 'Sin categoría',
            numeroPartida: partida.numeroPartida || 'Sin número',
            proveedor: item.proveedor?.nombre || 'Sin proveedor',
            kilos: partida.kilos || 0,
            unidades: partida.unidades || 0,
          });
        });
      });
    });
    
    return flatItems;
  }, [stock]);

  const filteredStock = useMemo(() => {
    if (!flattenedStock || flattenedStock.length === 0) return [];
    
    return flattenedStock.filter((item) => {
      const posicion = (item.posicion || '').toLowerCase();
      const descripcion = (item.descripcion || 'Sin descripción').toLowerCase();
      const categoria = (item.categoria || 'Sin categoría').toLowerCase();
      const numeroPartida = (item.numeroPartida || 'Sin número').toString().toLowerCase();
      const proveedor = (item.proveedor || 'Sin proveedor').toLowerCase();
      const kilos = item.kilos || 0;
      const unidades = item.unidades || 0;

      return (
        posicion.includes(filters.posicion.toLowerCase()) &&
        descripcion.includes(filters.descripcion.toLowerCase()) &&
        categoria.includes(filters.categoria.toLowerCase()) &&
        numeroPartida.includes(filters.numeroPartida.toLowerCase()) &&
        proveedor.includes(filters.proveedor.toLowerCase()) &&
        (filters.kilos === '' || kilos.toString().includes(filters.kilos)) &&
        (filters.unidades === '' || unidades.toString().includes(filters.unidades))
      );
    });
  }, [flattenedStock, filters]);

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  if (isLoading) {
    return (
      <section style={containerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={containerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section style={containerStyle}>
      <h2 style={titleStyle}>{title}</h2>
      {children || (
        <div>
          {flattenedStock && flattenedStock.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Posición</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Descripción</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Número Partida</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Proveedor</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd' }}>Kilos</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd' }}>Unidades</th>
                  </tr>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.posicion}
                        onChange={(e) => handleFilterChange('posicion', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.descripcion}
                        onChange={(e) => handleFilterChange('descripcion', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.categoria}
                        onChange={(e) => handleFilterChange('categoria', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.numeroPartida}
                        onChange={(e) => handleFilterChange('numeroPartida', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.proveedor}
                        onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.kilos}
                        onChange={(e) => handleFilterChange('kilos', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filters.unidades}
                        onChange={(e) => handleFilterChange('unidades', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.25rem',
                          border: '1px solid #ccc',
                          borderRadius: '3px',
                          fontSize: '0.875rem',
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.length > 0 ? (
                    filteredStock.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.posicion || 'Sin posición'}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.descripcion || 'Sin descripción'}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.categoria || 'Sin categoría'}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.numeroPartida || 'Sin número'}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.proveedor || 'Sin proveedor'}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>{item.kilos || 0}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>{item.unidades || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                        No se encontraron resultados con los filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {filters.posicion || filters.descripcion || filters.categoria || filters.numeroPartida || filters.proveedor || filters.kilos || filters.unidades ? (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                  Mostrando {filteredStock.length} de {flattenedStock.length} registros
                </div>
              ) : null}
            </div>
          ) : (
            <p>No hay elementos para mostrar.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ListadoStock;

