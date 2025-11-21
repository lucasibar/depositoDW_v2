import React from 'react';
import './SelectorFechas.css';

/**
 * Componente para seleccionar rango de fechas
 */
export const SelectorFechas = ({ fechaDesde, fechaHasta, onFechaDesdeChange, onFechaHastaChange, onBuscar }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fechaDesde && fechaHasta && onBuscar) {
      onBuscar();
    }
  };

  return (
    <div className="selector-fechas">
      <h3>Seleccionar Período</h3>
      <form onSubmit={handleSubmit} className="form-fechas">
        <div className="fecha-input-group">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            id="fechaDesde"
            type="date"
            value={fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
            required
          />
        </div>
        
        <div className="fecha-input-group">
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            id="fechaHasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-buscar"
          disabled={!fechaDesde || !fechaHasta}
        >
          Buscar Datos
        </button>
      </form>
    </div>
  );
};
