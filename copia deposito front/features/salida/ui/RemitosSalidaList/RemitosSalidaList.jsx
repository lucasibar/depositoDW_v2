import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import styles from './RemitosSalidaList.module.css';

export const RemitosSalidaList = ({ remitos, loading, error, onDeleteItem }) => {
  const [expandedRemitos, setExpandedRemitos] = useState({});
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generar meses (mes actual + meses anteriores + meses posteriores)
  const months = useMemo(() => {
    const monthsList = [];
    const currentDate = new Date();
    
    // Generar 6 meses hacia atrás (anteriores)
    for (let i = 6; i > 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthsList.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    
    // Agregar mes actual
    const currentMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    monthsList.push({
      year: currentMonthDate.getFullYear(),
      month: currentMonthDate.getMonth(),
      label: currentMonthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      key: `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}`
    });
    
    // Generar 6 meses hacia adelante (posteriores)
    for (let i = 1; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      monthsList.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    
    return monthsList;
  }, []);

  // Filtrar remitos por mes actual
  const currentMonth = months[currentMonthIndex];
  const remitosDelMes = useMemo(() => {
    if (!currentMonth) return [];
    
    return remitos.filter(remito => {
      const remitoDate = new Date(remito.fechaOriginal);
      return remitoDate.getFullYear() === currentMonth.year && 
             remitoDate.getMonth() === currentMonth.month;
    });
  }, [remitos, currentMonth]);

  // Función para filtrar items dentro de un remito
  const filterItemsInRemito = (items, searchWords) => {
    if (!searchWords.length || !items) return items || [];
    
    return items.filter(item => {
      if (!item) return false;
      
      const searchableText = [
        item.descripcion || '',
        item.categoria || '',
        item.proveedor || '',
        item.partida || ''
      ].join(' ').toLowerCase();
      
      return searchWords.every(word => searchableText.includes(word));
    });
  };

  // Filtrar remitos y sus items por término de búsqueda
  const filteredRemitos = useMemo(() => {
    if (!searchTerm.trim()) return remitosDelMes;
    
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    return remitosDelMes
      .map(remito => {
        if (!remito || !remito.items) return null;
        
        // Filtrar items dentro del remito
        const filteredItems = filterItemsInRemito(remito.items, searchWords);
        
        // Solo incluir el remito si tiene items que coincidan
        if (filteredItems.length > 0) {
          return {
            ...remito,
            items: filteredItems
          };
        }
        return null;
      })
      .filter(remito => remito !== null); // Remover remitos sin items que coincidan
  }, [remitosDelMes, searchTerm]);

  // Calcular estadísticas basadas en items filtrados
  const stats = useMemo(() => {
    const totalKilos = filteredRemitos.reduce((sum, remito) => 
      sum + remito.items.reduce((itemSum, item) => itemSum + (parseFloat(item.kilos) || 0), 0), 0
    );
    
    const totalUnidades = filteredRemitos.reduce((sum, remito) => 
      sum + remito.items.reduce((itemSum, item) => itemSum + (parseInt(item.unidades) || 0), 0), 0
    );
    
    const materialesUnicos = new Set();
    filteredRemitos.forEach(remito => {
      remito.items.forEach(item => {
        if (item.descripcion) materialesUnicos.add(item.descripcion);
      });
    });
    
    const remitosCount = filteredRemitos.length;
    
    return {
      totalKilos: totalKilos.toFixed(2),
      totalUnidades,
      materialesUnicos: materialesUnicos.size,
      remitosCount
    };
  }, [filteredRemitos]);

  const getKey = (remito) => `${remito.fecha}-${remito.proveedor}`;

  const toggleRemito = (key) => {
    setExpandedRemitos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMonthChange = (direction) => {
    if (direction === 'next' && currentMonthIndex < months.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else if (direction === 'prev' && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleDeleteItem = (remitoKey, itemId) => {
    if (onDeleteItem) {
      onDeleteItem(remitoKey, itemId);
    }
  };

  // Mostrar 6 meses visibles centrados en el mes actual
  const startIndex = Math.max(0, Math.min(currentMonthIndex - 2, months.length - 6));
  const visibleMonths = months.slice(startIndex, startIndex + 6);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando historial...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header con búsqueda */}
      <div className={styles.header}>
        <div className={styles.searchSection}>
          <TextField
            fullWidth
            placeholder="Buscar por proveedor, material, categoría, partida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            size="small"
          />
        </div>
      </div>
      
      {/* Panel de estadísticas */}
      <div className={styles.statsPanel}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {stats.remitosCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Remitos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {stats.totalKilos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Kilos Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {stats.totalUnidades}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unidades
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {stats.materialesUnicos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Materiales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Navegación de meses */}
      <div className={styles.monthNavigation}>
        <Button 
          onClick={() => handleMonthChange('prev')}
          disabled={currentMonthIndex === 0}
          variant="outlined"
          size="small"
        >
          ←
        </Button>
        
        <div className={styles.monthInfo}>
          <Typography variant="h6" color="primary">
            {currentMonth?.label}
          </Typography>
        </div>
        
        <div className={styles.monthDots}>
          {visibleMonths.map((month, index) => {
            const actualIndex = startIndex + index;
            return (
              <IconButton
                key={month.key}
                onClick={() => setCurrentMonthIndex(actualIndex)}
                size="small"
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: actualIndex === currentMonthIndex ? 'primary.main' : 'grey.300',
                  '&:hover': {
                    backgroundColor: actualIndex === currentMonthIndex ? 'primary.dark' : 'grey.400',
                  }
                }}
              />
            );
          })}
        </div>
        
        <Button 
          onClick={() => handleMonthChange('next')}
          disabled={currentMonthIndex >= months.length - 1}
          variant="outlined"
          size="small"
        >
          →
        </Button>
      </div>

      {/* Lista de remitos */}
      <div className={styles.remitosList}>
        {filteredRemitos.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              No hay remitos para {currentMonth?.label}
            </Typography>
            {searchTerm && (
              <Typography variant="body2" color="textSecondary">
                No se encontraron resultados para "{searchTerm}"
              </Typography>
            )}
          </Box>
        ) : (
          filteredRemitos.map(remito => {
            const key = getKey(remito);
            return (
              <div key={key} className={styles.remito}>
                <div 
                  className={styles.remitoHeader}
                  onClick={() => toggleRemito(key)}
                >
                  <span className={styles.fecha}>
                    {new Date(remito.fechaOriginal).toLocaleDateString()}
                  </span>
                  <span className={styles.proveedor}>{remito.proveedor}</span>
                  <span className={styles.arrow}>
                    {expandedRemitos[key] ? '▼' : '▶'}
                  </span>
                </div>
                {expandedRemitos[key] && (
                  <div className={styles.items}>
                    <table className={styles.itemsTable}>
                      <thead>
                        <tr>
                          <th>Proveedor</th>
                          <th>Descripción</th>
                          <th>Kilos</th>
                          <th>Unidades</th>
                          <th>Categoría</th>
                          <th>Partida</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {remito.items.map(item => {
                          return (
                            <tr key={item.id} className={styles.item}>
                              <td>{item.proveedor}</td>
                              <td>{item.descripcion}</td>
                              <td>{item.kilos}</td>
                              <td>{item.unidades}</td>
                              <td>{item.categoria}</td>
                              <td>{item.partida}</td>
                              <td>
                                <Tooltip title="Eliminar item">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(key, item.id);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}; 