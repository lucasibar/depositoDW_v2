import React from 'react';
import './MetricasConsumo.css';

/**
 * Componente para mostrar métricas de consumo
 */
export const MetricasConsumo = ({ datos, materialesSeleccionados, materiales, unificar }) => {
  if (!datos || datos.length === 0) {
    return null;
  }

  // Calcular métricas
  const calcularMetricas = () => {
    const kilosTotales = datos.reduce((sum, dato) => sum + (dato.kilos || 0), 0);
    const fechasUnicas = [...new Set(datos.map(d => d.fecha))].length;
    const kilosPromedioDiario = fechasUnicas > 0 ? kilosTotales / fechasUnicas : 0;
    
    // Encontrar día con mayor consumo
    const diaMayorConsumo = datos.reduce((max, dato) => 
      dato.kilos > max.kilos ? dato : max, { kilos: 0, fecha: '' }
    );
    
    // Encontrar día con menor consumo (excluyendo ceros)
    const diasConConsumoPositivo = datos.filter(d => d.kilos > 0);
    const diaMenorConsumo = diasConConsumoPositivo.length > 0 
      ? diasConConsumoPositivo.reduce((min, dato) => 
          dato.kilos < min.kilos ? dato : min
        )
      : { kilos: 0, fecha: '' };

    return {
      kilosTotales,
      kilosPromedioDiario,
      fechasUnicas,
      diaMayorConsumo,
      diaMenorConsumo
    };
  };

  const metricas = calcularMetricas();

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearNumero = (numero, decimales = 2) => {
    return numero.toFixed(decimales);
  };

  return (
    <div className="metricas-consumo">
      <h4>📊 Métricas de Consumo</h4>
      
      <div className="metricas-grid">
        <div className="metrica-card principal">
          <div className="metrica-icon">📈</div>
          <div className="metrica-content">
            <div className="metrica-valor">{formatearNumero(metricas.kilosTotales)} kg</div>
            <div className="metrica-label">Total Consumido</div>
          </div>
        </div>

        <div className="metrica-card principal">
          <div className="metrica-icon">📅</div>
          <div className="metrica-content">
            <div className="metrica-valor">{formatearNumero(metricas.kilosPromedioDiario)} kg</div>
            <div className="metrica-label">Promedio Diario</div>
          </div>
        </div>

        <div className="metrica-card secundaria">
          <div className="metrica-icon">🔥</div>
          <div className="metrica-content">
            <div className="metrica-valor">{formatearNumero(metricas.diaMayorConsumo.kilos)} kg</div>
            <div className="metrica-label">Mayor Consumo</div>
            <div className="metrica-fecha">{formatearFecha(metricas.diaMayorConsumo.fecha)}</div>
          </div>
        </div>

        <div className="metrica-card secundaria">
          <div className="metrica-icon">📉</div>
          <div className="metrica-content">
            <div className="metrica-valor">{formatearNumero(metricas.diaMenorConsumo.kilos)} kg</div>
            <div className="metrica-label">Menor Consumo</div>
            <div className="metrica-fecha">{formatearFecha(metricas.diaMenorConsumo.fecha)}</div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="metricas-info">
        <div className="info-item">
          <span className="info-label">Período analizado:</span>
          <span className="info-value">{metricas.fechasUnicas} días</span>
        </div>
        <div className="info-item">
          <span className="info-label">Materiales seleccionados:</span>
          <span className="info-value">{materialesSeleccionados.length}</span>
        </div>
        {unificar && (
          <div className="info-item">
            <span className="info-label">Modo:</span>
            <span className="info-value">Datos unificados</span>
          </div>
        )}
      </div>
    </div>
  );
};
