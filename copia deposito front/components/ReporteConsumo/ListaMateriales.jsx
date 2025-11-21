import React, { useState, useMemo } from 'react';
import './ListaMateriales.css';

/**
 * Componente para mostrar lista de materiales con checkboxes
 */
export const ListaMateriales = ({ 
  materiales, 
  materialesSeleccionados, 
  onMaterialToggle, 
  onSeleccionarTodos, 
  onDeseleccionarTodos,
  loading = false,
  unificar = false,
  onUnificarChange,
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  onBuscar
}) => {
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  
  const todosSeleccionados = materiales.length > 0 && materialesSeleccionados.length === materiales.length;
  const algunosSeleccionados = materialesSeleccionados.length > 0 && materialesSeleccionados.length < materiales.length;

  // Filtrar materiales basado en la búsqueda
  const materialesFiltrados = useMemo(() => {
    if (!filtroBusqueda.trim()) {
      return materiales;
    }

    const terminoBusqueda = filtroBusqueda.toLowerCase().trim();
    
    return materiales.filter(material => {
      const descripcion = (material.descripcion || material.nombre || '').toLowerCase();
      const categoria = (material.categoria || '').toLowerCase();
      const proveedor = (material.proveedor?.nombre || '').toLowerCase();
      const codigo = (material.codigo || '').toLowerCase();
      
      return descripcion.includes(terminoBusqueda) ||
             categoria.includes(terminoBusqueda) ||
             proveedor.includes(terminoBusqueda) ||
             codigo.includes(terminoBusqueda);
    });
  }, [materiales, filtroBusqueda]);

  const handleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      onDeseleccionarTodos();
    } else {
      onSeleccionarTodos();
    }
  };

  const handleSeleccionarTodosFiltrados = () => {
    const materialesFiltradosIds = materialesFiltrados.map(m => m.id);
    const todosFiltradosSeleccionados = materialesFiltradosIds.every(id => materialesSeleccionados.includes(id));
    
    if (todosFiltradosSeleccionados) {
      // Deseleccionar todos los filtrados
      const nuevosSeleccionados = materialesSeleccionados.filter(id => !materialesFiltradosIds.includes(id));
      onDeseleccionarTodos();
      materialesFiltradosIds.forEach(id => {
        if (!nuevosSeleccionados.includes(id)) {
          onMaterialToggle(id);
        }
      });
    } else {
      // Seleccionar todos los filtrados
      materialesFiltradosIds.forEach(id => {
        if (!materialesSeleccionados.includes(id)) {
          onMaterialToggle(id);
        }
      });
    }
  };

  const todosFiltradosSeleccionados = materialesFiltrados.length > 0 && 
    materialesFiltrados.every(m => materialesSeleccionados.includes(m.id));

  return (
    <div className="lista-materiales">
      <div className="lista-header">
        <h3>Materiales Disponibles</h3>
        {!loading && materiales && materiales.length > 0 && (
          <div className="controles-seleccion">
            <button 
              className="btn-seleccionar-todos"
              onClick={handleSeleccionarTodos}
              disabled={materiales.length === 0}
            >
              {todosSeleccionados ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
            </button>
            <span className="contador-seleccionados">
              {materialesSeleccionados.length} de {materiales.length} seleccionados
            </span>
          </div>
        )}
      </div>

      {/* Selectores de fecha */}
      <div className="fecha-selectors">
        <div className="fecha-input-group">
          <input
            type="date"
            value={fechaDesde || ''}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
            className="fecha-input"
            placeholder="Desde"
          />
        </div>
        <div className="fecha-input-group">
          <input
            type="date"
            value={fechaHasta || ''}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            className="fecha-input"
            placeholder="Hasta"
          />
        </div>
        <button 
          className="btn-buscar"
          onClick={onBuscar}
          disabled={!fechaDesde || !fechaHasta || loading}
        >
          🔍
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Buscar por descripción, categoría, proveedor o código..."
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            className="search-input"
            disabled={loading || !materiales || materiales.length === 0}
          />
          <div className="search-icon">🔍</div>
        </div>
        {filtroBusqueda && materiales && materiales.length > 0 && (
          <div className="search-results-info">
            <span className="search-count">
              {materialesFiltrados.length} de {materiales.length} materiales encontrados
            </span>
            {materialesFiltrados.length > 0 && (
              <button 
                className="btn-seleccionar-filtrados"
                onClick={handleSeleccionarTodosFiltrados}
              >
                {todosFiltradosSeleccionados ? 'Deseleccionar Filtrados' : 'Seleccionar Filtrados'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div className="loading-message">Cargando materiales...</div>
      )}

      {!loading && (!materiales || materiales.length === 0) && (
        <div className="no-data-message">No hay materiales disponibles para el período seleccionado</div>
      )}

      {!loading && materiales && materiales.length > 0 && (
        <div className="lista-contenido">
          {materialesFiltrados.length === 0 && filtroBusqueda ? (
            <div className="no-results-message">
              No se encontraron materiales que coincidan con "{filtroBusqueda}"
            </div>
          ) : (
            materialesFiltrados.map((material) => (
            <div key={material.id} className="material-item">
              <label className="material-checkbox">
                <input
                  type="checkbox"
                  checked={materialesSeleccionados.includes(material.id)}
                  onChange={() => onMaterialToggle(material.id)}
                />
                <span className="checkbox-custom"></span>
                <div className="material-info">
                  <div className="material-nombre">
                    {material.proveedor?.nombre || 'Sin proveedor'}, {material.categoria || 'Sin categoría'}, {material.nombre}
                  </div>
                  {material.unidad && (
                    <div className="material-unidad">Unidad: {material.unidad}</div>
                  )}
                </div>
              </label>
            </div>
            ))
          )}
        </div>
      )}
      
      {/* Checkbox de unificar */}
      {materialesSeleccionados.length > 0 && (
        <div className="unificar-container">
          <label className="unificar-checkbox">
            <input
              type="checkbox"
              checked={unificar}
              onChange={onUnificarChange}
            />
            <span className="checkbox-custom"></span>
            <span className="unificar-text">
              Unificar cantidades
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
