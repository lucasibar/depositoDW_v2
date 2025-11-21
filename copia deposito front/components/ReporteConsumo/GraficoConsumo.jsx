import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MetricasConsumo } from './MetricasConsumo';
import './GraficoConsumo.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Componente de gráfico de líneas para mostrar consumo de materiales
 */
export const GraficoConsumo = ({ 
  datos, 
  materialesSeleccionados, 
  materiales, 
  unificar = false,
  loading = false 
}) => {
  const chartRef = useRef(null);

  // Preparar datos para Chart.js
  const prepararDatosGrafico = () => {
    if (!datos || datos.length === 0) return null;

    // Obtener fechas únicas y ordenarlas
    const fechas = [...new Set(datos.map(d => d.fecha))].sort();
    
    const datasets = [];

    if (unificar) {
      // Crear dataset unificado
      const datosUnificados = fechas.map(fecha => {
        const kilosFecha = datos
          .filter(d => d.fecha === fecha)
          .reduce((sum, d) => sum + d.kilos, 0);
        return kilosFecha;
      });

      datasets.push({
        label: 'Consumo Total',
        data: datosUnificados,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1
      });
    } else {
      // Crear datasets individuales para cada material
      const colores = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];
      
      materialesSeleccionados.forEach((materialId, index) => {
        const material = materiales.find(m => m.id === materialId);
        if (!material) return;

        const datosMaterial = fechas.map(fecha => {
          const datoFecha = datos.find(d => d.fecha === fecha && d.materialId === materialId);
          return datoFecha ? datoFecha.kilos : 0;
        });

        // Crear etiqueta completa con proveedor, categoría y descripción
        const proveedor = material.proveedor?.nombre || 'Sin proveedor';
        const categoria = material.categoria || 'Sin categoría';
        const descripcion = material.nombre || material.descripcion || 'Sin descripción';
        const labelCompleto = `${proveedor}, ${categoria}, ${descripcion}`;

        datasets.push({
          label: labelCompleto,
          data: datosMaterial,
          borderColor: colores[index % colores.length],
          backgroundColor: `${colores[index % colores.length]}20`,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1
        });
      });
    }

    return {
      labels: fechas.map(fecha => 
        new Date(fecha).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets
    };
  };

  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kg`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Fecha',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Kilos Consumidos',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(1) + ' kg';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const datosGrafico = prepararDatosGrafico();

  if (loading) {
    return (
      <div className="grafico-consumo">
        <h3>Gráfico de Consumo</h3>
        <div className="loading-message">Cargando gráfico...</div>
      </div>
    );
  }

  if (!datosGrafico || datosGrafico.datasets.length === 0) {
    return (
      <div className="grafico-consumo">
        <h3>Gráfico de Consumo</h3>
        <div className="no-data-message">
          Selecciona materiales para ver el gráfico de consumo
        </div>
      </div>
    );
  }

  return (
    <div className="grafico-consumo">
      <div className="grafico-header">
        <h3>Gráfico de Consumo</h3>
        {unificar && (
          <div className="unificado-indicator">
            <span className="indicator-dot"></span>
            Datos Unificados
          </div>
        )}
      </div>
      
      <div className="grafico-container">
        <Line 
          ref={chartRef}
          data={datosGrafico} 
          options={opcionesGrafico}
        />
      </div>
      
      {/* Métricas de consumo */}
      <MetricasConsumo 
        datos={datos}
        materialesSeleccionados={materialesSeleccionados}
        materiales={materiales}
        unificar={unificar}
      />
    </div>
  );
};
