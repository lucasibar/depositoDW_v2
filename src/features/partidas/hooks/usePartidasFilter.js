import { useState, useMemo } from 'react';

export const usePartidasFilter = (partidas) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartidas = useMemo(() => {
    if (!searchTerm) return partidas;
    
    const term = searchTerm.toLowerCase();
    return partidas.filter(partida => {
      const numeroPartida = (partida.numeroPartida || partida.id || '').toString().toLowerCase();
      const descripcion = (partida.descripcionItem || '').toLowerCase();
      const categoria = (partida.item?.categoria || '').toLowerCase();
      const proveedor = (partida.proveedor || '').toLowerCase();
      
      return numeroPartida.includes(term) || 
             descripcion.includes(term) || 
             categoria.includes(term) || 
             proveedor.includes(term);
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