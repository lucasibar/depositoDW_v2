import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Scale as ScaleIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import styles from './StockMetricsPanel.module.css';
import DetailedItemMetrics from './DetailedItemMetrics';

const MetricCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <div className={`${styles.metricIcon} ${styles[color]}`}>
          <Icon />
        </div>
        <h3 className={styles.metricTitle}>{title}</h3>
      </div>
      
      <h2 className={styles.metricValue}>{value}</h2>
      
      {subtitle && (
        <p className={styles.metricSubtitle}>{subtitle}</p>
      )}
    </div>
  );
};

const StockMetricsPanel = ({ data, searchTerm, selectedPosition }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Función para verificar si un item cumple con todas las condiciones del filtro
  const itemMatchesAllConditions = (item, searchTerms) => {
    if (!searchTerms || searchTerms.length === 0) return true;
    
    // Crear texto combinado del item incluyendo todas sus partidas
    const itemTexts = [];
    itemTexts.push(item.item?.categoria || '');
    itemTexts.push(item.item?.descripcion || '');
    itemTexts.push(item.item?.proveedor?.nombre || '');
    
    // Agregar números de partida
    (item.partidas || []).forEach(partida => {
      itemTexts.push(partida.numeroPartida || '');
    });
    
    const combinedItemText = itemTexts.join(' ').toLowerCase();
    
    // Verificar que TODOS los términos de búsqueda estén presentes
    return searchTerms.every(term => combinedItemText.includes(term));
  };

  // Calcular métricas basadas en los datos filtrados
  const calculateMetrics = () => {
    if (!data || !Array.isArray(data)) {
      return {
        totalKilos: 0,
        totalUnidades: 0,
        totalPosiciones: 0,
        posicionesVacias: 0,
        posicionesOcupadas: 0,
        materialesUnicos: 0,
        partidasUnicas: 0,
        proveedoresUnicos: 0,
        categoriasUnicas: 0
      };
    }

    let totalKilos = 0;
    let totalUnidades = 0;
    const materialesSet = new Set();
    const partidasSet = new Set();
    const proveedoresSet = new Set();
    const categoriasSet = new Set();
    let posicionesOcupadas = 0;

    // Obtener términos de búsqueda
    const searchTerms = searchTerm ? searchTerm.toLowerCase().trim().split(/\s+/) : [];

    data.forEach(posicion => {
      if (posicion.items && posicion.items.length > 0) {
        posicionesOcupadas++;
        
        posicion.items.forEach(item => {
          // Solo considerar items que cumplan con TODAS las condiciones del filtro
          if (itemMatchesAllConditions(item, searchTerms)) {
            if (item.item?.id) {
              materialesSet.add(item.item.id);
            }
            
            if (item.item?.categoria) {
              categoriasSet.add(item.item.categoria);
            }
            
            if (item.item?.proveedor?.id) {
              proveedoresSet.add(item.item.proveedor.id);
            }
            
            if (item.partidas && item.partidas.length > 0) {
              item.partidas.forEach(partida => {
                totalKilos += partida.kilos || 0;
                totalUnidades += partida.unidades || 0;
                
                if (partida.numeroPartida) {
                  partidasSet.add(partida.numeroPartida);
                }
              });
            }
          }
        });
      }
    });

    const totalPosiciones = data.length;
    const posicionesVacias = totalPosiciones - posicionesOcupadas;

    return {
      totalKilos: Math.round(totalKilos * 100) / 100,
      totalUnidades,
      totalPosiciones,
      posicionesVacias,
      posicionesOcupadas,
      materialesUnicos: materialesSet.size,
      partidasUnicas: partidasSet.size,
      proveedoresUnicos: proveedoresSet.size,
      categoriasUnicas: categoriasSet.size
    };
  };

  const metrics = calculateMetrics();

  // Determinar el contexto del filtro
  const getFilterContext = () => {
    if (searchTerm) {
      return `Filtrado por: "${searchTerm}"`;
    }
    if (selectedPosition) {
      return `Posición: ${selectedPosition.rack ? `${selectedPosition.rack}-${selectedPosition.fila}-${selectedPosition.AB}` : `Pasillo ${selectedPosition.numeroPasillo}`}`;
    }
    return 'Vista general del stock';
  };

  return (
    <div className={styles.metricsPanel}>
      {/* Grid de métricas */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Kilos"
          value={`${metrics.totalKilos.toLocaleString()} kg`}
          icon={ScaleIcon}
          color="primary"
        />
        
        <MetricCard
          title="Total Unidades"
          value={metrics.totalUnidades.toLocaleString()}
          icon={InventoryIcon}
          color="secondary"
        />
        
        <MetricCard
          title="Posiciones"
          value={`${metrics.posicionesOcupadas}/${metrics.totalPosiciones}`}
          icon={LocationIcon}
          color="success"
        />
        
        <MetricCard
          title="Materiales"
          value={metrics.materialesUnicos}
          icon={CategoryIcon}
          color="info"
        />

        <MetricCard
          title="Partidas"
          value={metrics.partidasUnicas}
          icon={AssignmentIcon}
          color="warning"
        />
        
        <MetricCard
          title="Proveedores"
          value={metrics.proveedoresUnicos}
          icon={BusinessIcon}
          color="error"
        />
        
        <MetricCard
          title="Categorías"
          value={metrics.categoriasUnicas}
          icon={TrendingUpIcon}
          color="info"
        />
        
        <MetricCard
          title="Ocupación"
          value={`${metrics.totalPosiciones > 0 ? Math.round((metrics.posicionesOcupadas / metrics.totalPosiciones) * 100) : 0}%`}
          icon={LocationIcon}
          color="success"
        />
      </div>
    </div>
  );
};

export default StockMetricsPanel;
