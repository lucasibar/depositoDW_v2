import React, { useState } from "react";
import styles from "./SearchBar.module.css";

export const SearchBar = ({ 
  placeholder = "Buscar...", 
  onSearch, 
  debounceMs = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce para evitar muchas llamadas al servidor
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.input}
      />
      {searchTerm && (
        <button 
          onClick={handleClear}
          className={styles.clearButton}
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
};
