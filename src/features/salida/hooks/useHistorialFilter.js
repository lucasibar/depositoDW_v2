import { useSelector } from 'react-redux';

export const useHistorialFilter = (searchTerms) => {
  const { historialSalida = [], loading, error } = useSelector(state => state.historial);

  // Filtrar datos basado en los términos de búsqueda
  const filteredData = historialSalida.filter(remito => {
    if (!searchTerms || searchTerms.length === 0) {
      return true;
    }

    // Buscar en todos los campos del remito
    const searchableText = [
      remito.fecha,
      remito.proveedor,
      remito.numeroRemito,
      ...(remito.items || []).map(item => [
        item.descripcion,
        item.categoria,
        item.proveedor,
        item.partida
      ].join(' '))
    ].join(' ').toLowerCase();

    // Verificar si todos los términos de búsqueda están presentes
    return searchTerms.every(term => 
      searchableText.includes(term.toLowerCase())
    );
  });

  return {
    filteredData,
    chartData: historialSalida, // Para el gráfico (si se implementa)
    loading,
    error
  };
}; 