import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com';

export const usePosicionesVacias = () => {
  const [posicionesVacias, setPosicionesVacias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    rack: 0,
    pasillo: 0,
    entrada: 0
  });

  const cargarPosicionesVacias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/posiciones/vacias`;
      console.log('🔄 usePosicionesVacias: Cargando posiciones vacías...');
      console.log('🌐 URL:', url);
      console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔧 API_BASE_URL:', API_BASE_URL);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ usePosicionesVacias: Posiciones vacías cargadas:', data);
      console.log('📊 Total posiciones:', data.length);
      
      setPosicionesVacias(data);
      calcularEstadisticas(data);
      
      return data;
    } catch (error) {
      console.error('❌ usePosicionesVacias: Error cargando posiciones vacías:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const calcularEstadisticas = useCallback((posiciones) => {
    const stats = {
      total: posiciones.length,
      rack: posiciones.filter(p => p.rack && p.fila && p.AB).length,
      pasillo: posiciones.filter(p => p.numeroPasillo).length,
      entrada: posiciones.filter(p => p.entrada).length
    };
    setStats(stats);
  }, []);

  const formatearPosicion = useCallback((posicion) => {
    if (posicion.rack && posicion.fila && posicion.AB) {
      return `Rack ${posicion.rack} - Fila ${posicion.fila} - Nivel ${posicion.AB}`;
    } else if (posicion.numeroPasillo) {
      return `Pasillo Nº ${posicion.numeroPasillo}`;
    } else if (posicion.entrada) {
      return 'Entrada';
    }
    return 'Sin especificar';
  }, []);

  const obtenerColorTipo = useCallback((posicion) => {
    if (posicion.rack && posicion.fila && posicion.AB) {
      return 'primary';
    } else if (posicion.numeroPasillo) {
      return 'secondary';
    } else if (posicion.entrada) {
      return 'success';
    }
    return 'default';
  }, []);

  const obtenerIconoTipo = useCallback((posicion) => {
    if (posicion.rack && posicion.fila && posicion.AB) {
      return 'grid3x3';
    } else if (posicion.numeroPasillo) {
      return 'storage';
    } else if (posicion.entrada) {
      return 'location_on';
    }
    return 'location_on';
  }, []);

  // Valores únicos para filtros
  const valoresUnicos = useMemo(() => {
    const racks = [...new Set(posicionesVacias.filter(p => p.rack).map(p => p.rack))].sort((a, b) => a - b);
    const filas = [...new Set(posicionesVacias.filter(p => p.fila).map(p => p.fila))].sort((a, b) => a - b);
    const niveles = [...new Set(posicionesVacias.filter(p => p.AB).map(p => p.AB))].sort();
    const pasillos = [...new Set(posicionesVacias.filter(p => p.numeroPasillo).map(p => p.numeroPasillo))].sort((a, b) => a - b);
    
    return { racks, filas, niveles, pasillos };
  }, [posicionesVacias]);

  const filtrarPorTipo = useCallback((tipo) => {
    switch (tipo) {
      case 'rack':
        return posicionesVacias.filter(p => p.rack && p.fila && p.AB);
      case 'pasillo':
        return posicionesVacias.filter(p => p.numeroPasillo);
      case 'entrada':
        return posicionesVacias.filter(p => p.entrada);
      default:
        return posicionesVacias;
    }
  }, [posicionesVacias]);

  const buscarPosicion = useCallback((termino) => {
    if (!termino) return posicionesVacias;
    
    const term = termino.toLowerCase();
    return posicionesVacias.filter(posicion => {
      const descripcion = formatearPosicion(posicion).toLowerCase();
      return descripcion.includes(term);
    });
  }, [posicionesVacias, formatearPosicion]);

  // Filtrar por múltiples criterios
  const filtrarPorCriterios = useCallback((criterios) => {
    return posicionesVacias.filter(posicion => {
      if (criterios.rack && posicion.rack !== parseInt(criterios.rack)) return false;
      if (criterios.fila && posicion.fila !== parseInt(criterios.fila)) return false;
      if (criterios.nivel && posicion.AB !== criterios.nivel) return false;
      if (criterios.pasillo && posicion.numeroPasillo !== parseInt(criterios.pasillo)) return false;
      return true;
    });
  }, [posicionesVacias]);

  // Obtener posiciones por área específica
  const obtenerPosicionesPorArea = useCallback((area) => {
    switch (area) {
      case 'rack':
        return posicionesVacias.filter(p => p.rack && p.fila && p.AB);
      case 'pasillo':
        return posicionesVacias.filter(p => p.numeroPasillo);
      case 'entrada':
        return posicionesVacias.filter(p => p.entrada);
      default:
        return posicionesVacias;
    }
  }, [posicionesVacias]);

  // Estadísticas por área
  const estadisticasPorArea = useMemo(() => {
    const rack = obtenerPosicionesPorArea('rack');
    const pasillo = obtenerPosicionesPorArea('pasillo');
    const entrada = obtenerPosicionesPorArea('entrada');
    
    return {
      rack: {
        total: rack.length,
        racks: [...new Set(rack.map(p => p.rack))].sort((a, b) => a - b),
        filas: [...new Set(rack.map(p => p.fila))].sort((a, b) => a - b),
        niveles: [...new Set(rack.map(p => p.AB))].sort()
      },
      pasillo: {
        total: pasillo.length,
        pasillos: [...new Set(pasillo.map(p => p.numeroPasillo))].sort((a, b) => a - b)
      },
      entrada: {
        total: entrada.length
      }
    };
  }, [obtenerPosicionesPorArea]);

  useEffect(() => {
    cargarPosicionesVacias();
  }, [cargarPosicionesVacias]);

  return {
    // Estado
    posicionesVacias,
    loading,
    error,
    stats,
    
    // Funciones
    cargarPosicionesVacias,
    formatearPosicion,
    obtenerColorTipo,
    obtenerIconoTipo,
    filtrarPorTipo,
    buscarPosicion,
    filtrarPorCriterios,
    obtenerPosicionesPorArea,
    
    // Valores únicos para filtros
    valoresUnicos,
    
    // Estadísticas por área
    estadisticasPorArea,
    
    // Utilidades
    hayPosicionesVacias: posicionesVacias.length > 0,
    totalPosiciones: posicionesVacias.length,
    
    // Métodos de filtrado avanzados
    filtrarPorRack: (rack) => posicionesVacias.filter(p => p.rack === parseInt(rack)),
    filtrarPorFila: (fila) => posicionesVacias.filter(p => p.fila === parseInt(fila)),
    filtrarPorNivel: (nivel) => posicionesVacias.filter(p => p.AB === nivel),
    filtrarPorPasillo: (pasillo) => posicionesVacias.filter(p => p.numeroPasillo === parseInt(pasillo))
  };
};
