import { useState, useMemo } from 'react';

export const usePartidasFilter = (partidas) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartidas = useMemo(() => {
    if (!searchTerm.trim()) {
      return partidas;
    }
    
    // Dividir el término de búsqueda en palabras individuales
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    return partidas.filter(partida => {
      // Crear un texto combinado con todos los campos buscables
      const searchableText = [
        partida.proveedor || '',
        partida.descripcionItem || '',
        partida.item?.categoria || '',
        (partida.numeroPartida || partida.id || '').toString()
      ].join(' ').toLowerCase();
      
      // Verificar si TODAS las palabras están presentes en el texto combinado
      return searchWords.every(word => searchableText.includes(word));
    });
  }, [partidas, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    filteredPartidas,
    handleSearch
  };
}; 