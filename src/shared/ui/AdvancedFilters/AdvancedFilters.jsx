import React from "react";
import styles from "./AdvancedFilters.module.css";
import { ADVANCED_FILTERS } from "../../../features/stock/constants/stockConstants";

export const AdvancedFilters = ({ 
  filters, 
  onFilterChange 
}) => {
  const racks = Array.from({ length: ADVANCED_FILTERS.RACK.MAX }, (_, i) => i + ADVANCED_FILTERS.RACK.MIN);
  const filas = Array.from({ length: ADVANCED_FILTERS.FILA.MAX }, (_, i) => i + ADVANCED_FILTERS.FILA.MIN);
  const abOptions = ADVANCED_FILTERS.AB.OPTIONS;
  const pasillos = Array.from({ length: ADVANCED_FILTERS.PASILLO.MAX }, (_, i) => i + ADVANCED_FILTERS.PASILLO.MIN);

  const handleFilterChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };

  return (
    <div className={styles.filtersContainer}>
      <select
        className={styles.filterSelect}
        value={filters.rack || ''}
        onChange={(e) => handleFilterChange('rack', e.target.value)}
      >
        <option value="">Rack</option>
        {racks.map(rack => (
          <option key={rack} value={rack}>R{rack}</option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={filters.fila || ''}
        onChange={(e) => handleFilterChange('fila', e.target.value)}
      >
        <option value="">Fila</option>
        {filas.map(fila => (
          <option key={fila} value={fila}>F{fila}</option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={filters.ab || ''}
        onChange={(e) => handleFilterChange('ab', e.target.value)}
      >
        <option value="">A/B</option>
        {abOptions.map(ab => (
          <option key={ab} value={ab}>{ab}</option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={filters.pasillo || ''}
        onChange={(e) => handleFilterChange('pasillo', e.target.value)}
      >
        <option value="">Pasillo</option>
        {pasillos.map(pasillo => (
          <option key={pasillo} value={pasillo}>P{pasillo}</option>
        ))}
      </select>
    </div>
  );
}; 