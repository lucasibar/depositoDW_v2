import React, { useState } from 'react';
import { useOptimizedStock } from '../features/stock/hooks/useOptimizedStock';
import { usePosicionesCache } from '../features/stock/hooks/usePosicionesCache';
import { useOptimizedMovements } from '../features/stock/hooks/useOptimizedMovements';
import OptimizedLoadingSpinner from './OptimizedLoadingSpinner';

const OptimizedStockExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  
  // Hooks optimizados
  const { 
    stock, 
    filteredMaterials, 
    isLoading: stockLoading, 
    handleSearch,
    performanceStats 
  } = useOptimizedStock();
  
  const { 
    posiciones, 
    isLoading: posicionesLoading, 
    getPosicionById,
    stats: posicionesStats 
  } = usePosicionesCache();
  
  const { 
    executeMovimientoInterno,
    executeAdicionRapida,
    posiciones: posicionesMovimientos 
  } = useOptimizedMovements();

  // Manejar búsqueda con debounce automático
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  // Ejemplo de movimiento interno optimista
  const handleMovimientoInterno = async () => {
    if (!selectedPosicion) return;
    
    const movimientoData = {
      selectedItem: { id: 1, nombre: 'Item de ejemplo' },
      data: {
        posicionDestinoId: 2,
        kilos: 10,
        unidades: 5
      },
      id: selectedPosicion.id
    };

    console.log('Ejecutando movimiento interno optimista...');
    const result = await executeMovimientoInterno(movimientoData);
    
    if (result.success) {
      console.log('Movimiento exitoso:', result.data);
    } else {
      console.error('Error en movimiento:', result.error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Optimizado</h2>
      
      {/* Indicadores de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Stock</h3>
          <p>Items: {stock.length}</p>
          <p>Filtrados: {filteredMaterials.length}</p>
          <p>Última carga: {performanceStats.lastFetch ? new Date(performanceStats.lastFetch).toLocaleTimeString() : 'Nunca'}</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Posiciones</h3>
          <p>Total: {posicionesStats.total}</p>
          <p>Con stock: {posicionesStats.conStock}</p>
          <p>Vacías: {posicionesStats.vacias}</p>
        </div>
        
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold">Caché</h3>
          <p>Items: {performanceStats.cacheStats.size}</p>
          <p>Memoria: {(performanceStats.cacheStats.memoryUsage / 1024 / 1024).toFixed(2)} MB</p>
          <p>Recargar: {performanceStats.shouldRefetch ? 'Sí' : 'No'}</p>
        </div>
      </div>

      {/* Búsqueda optimizada */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar materiales..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-lg"
        />
        <p className="text-sm text-gray-600 mt-1">
          Búsqueda con debounce automático (300ms)
        </p>
      </div>

      {/* Loading states */}
      {(stockLoading || posicionesLoading) && (
        <OptimizedLoadingSpinner 
          isLoading={true}
          message="Cargando datos optimizados..."
          size="medium"
        />
      )}

      {/* Lista de posiciones */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Posiciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {posiciones.slice(0, 6).map((posicion) => (
            <div 
              key={posicion.id}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedPosicion?.id === posicion.id ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
              }`}
              onClick={() => setSelectedPosicion(posicion)}
            >
              <h4 className="font-medium">{posicion.nombre || posicion.codigo}</h4>
              <p className="text-sm text-gray-600">
                Items: {posicion.items?.length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de movimiento optimista */}
      {selectedPosicion && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Movimiento Optimista - {selectedPosicion.nombre}
          </h3>
          <button
            onClick={handleMovimientoInterno}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Ejecutar Movimiento Interno (Inmediato)
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Los cambios se aplican inmediatamente en la UI y se sincronizan en segundo plano
          </p>
        </div>
      )}

      {/* Estadísticas de caché */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Estadísticas de Caché</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Stock:</strong> {performanceStats.cacheStats.size} items</p>
            <p><strong>Memoria:</strong> {(performanceStats.cacheStats.memoryUsage / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div>
            <p><strong>Posiciones:</strong> {posicionesStats.total}</p>
            <p><strong>Última carga:</strong> {posicionesStats.lastFetch ? new Date(posicionesStats.lastFetch).toLocaleTimeString() : 'Nunca'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedStockExample;
