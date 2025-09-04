import * as XLSX from 'xlsx';

/**
 * Exporta un array de datos a un archivo Excel
 * @param {Array} data - Array de objetos con los datos a exportar
 * @param {string} filename - Nombre del archivo (sin extensión)
 * @param {string} sheetName - Nombre de la hoja de cálculo
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Datos') => {
  try {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos a una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generar el archivo Excel
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    console.log(`✅ Archivo Excel exportado: ${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('❌ Error al exportar a Excel:', error);
    return false;
  }
};

/**
 * Exporta posiciones vacías a Excel con formato específico
 * @param {Array} posicionesVacias - Array de posiciones vacías
 * @param {Array} posicionesFiltradas - Array de posiciones filtradas (opcional)
 */
export const exportPosicionesVaciasToExcel = (posicionesVacias, posicionesFiltradas = null) => {
  const datosParaExportar = (posicionesFiltradas || posicionesVacias).map((posicion, index) => {
    // Determinar el tipo de posición
    let tipoPosicion = 'Sin especificar';
    let descripcionPosicion = 'Sin especificar';
    
    if (posicion.rack && posicion.fila && posicion.AB) {
      tipoPosicion = 'Sistema Rack/Fila/Nivel';
      descripcionPosicion = `Rack ${posicion.rack} - Fila ${posicion.fila} - Nivel ${posicion.AB}`;
    } else if (posicion.numeroPasillo) {
      tipoPosicion = 'Sistema Pasillo';
      descripcionPosicion = `Pasillo Nº ${posicion.numeroPasillo}`;
    } else if (posicion.entrada) {
      tipoPosicion = 'Entrada';
      descripcionPosicion = 'Entrada';
    }
    
    return {
      'Nº': index + 1,
      'ID Posición': posicion.id,
      'Tipo de Posición': tipoPosicion,
      'Descripción': descripcionPosicion,
      'Rack': posicion.rack || '-',
      'Fila': posicion.fila || '-',
      'Nivel': posicion.AB || '-',
      'Número Pasillo': posicion.numeroPasillo || '-',
      'Es Entrada': posicion.entrada ? 'Sí' : 'No',
      'Fecha de Creación': posicion.createdAt ? new Date(posicion.createdAt).toLocaleDateString('es-ES') : '-',
      'Última Actualización': posicion.updatedAt ? new Date(posicion.updatedAt).toLocaleDateString('es-ES') : '-'
    };
  });
  
  // Generar nombre de archivo con fecha y hora
  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  const nombreArchivo = `posiciones_vacias_${fecha}_${hora}`;
  
  // Exportar a Excel
  const exito = exportToExcel(
    datosParaExportar, 
    nombreArchivo, 
    'Posiciones Vacías'
  );
  
  if (exito) {
    // Mostrar mensaje de éxito
    const totalPosiciones = posicionesFiltradas ? posicionesFiltradas.length : posicionesVacias.length;
    const mensaje = posicionesFiltradas 
      ? `Se exportaron ${totalPosiciones} posiciones vacías filtradas a Excel`
      : `Se exportaron ${totalPosiciones} posiciones vacías a Excel`;
    
    console.log(`✅ ${mensaje}`);
    return { exito: true, mensaje, totalPosiciones };
  } else {
    return { exito: false, mensaje: 'Error al exportar el archivo Excel' };
  }
};

/**
 * Exporta estadísticas de posiciones vacías a Excel
 * @param {Object} stats - Objeto con las estadísticas
 * @param {Object} valoresUnicos - Objeto con valores únicos para filtros
 */
export const exportEstadisticasPosicionesToExcel = (stats, valoresUnicos) => {
  const datosEstadisticas = [
    {
      'Métrica': 'Total Posiciones Vacías',
      'Valor': stats.total,
      'Descripción': 'Total de posiciones vacías en el depósito'
    },
    {
      'Métrica': 'Sistema Rack/Fila/Nivel',
      'Valor': stats.rack,
      'Descripción': 'Posiciones con sistema de rack, fila y nivel'
    },
    {
      'Métrica': 'Sistema Pasillo',
      'Valor': stats.pasillo,
      'Descripción': 'Posiciones con sistema de pasillo'
    },
    {
      'Métrica': 'Entrada',
      'Valor': stats.entrada,
      'Descripción': 'Posiciones de entrada'
    }
  ];
  
  const datosValoresUnicos = [
    {
      'Categoría': 'Racks Disponibles',
      'Valores': valoresUnicos.racks ? valoresUnicos.racks.join(', ') : 'Ninguno',
      'Cantidad': valoresUnicos.racks ? valoresUnicos.racks.length : 0
    },
    {
      'Categoría': 'Filas Disponibles',
      'Valores': valoresUnicos.filas ? valoresUnicos.filas.join(', ') : 'Ninguno',
      'Cantidad': valoresUnicos.filas ? valoresUnicos.filas.length : 0
    },
    {
      'Categoría': 'Niveles Disponibles',
      'Valores': valoresUnicos.niveles ? valoresUnicos.niveles.join(', ') : 'Ninguno',
      'Cantidad': valoresUnicos.niveles ? valoresUnicos.niveles.length : 0
    },
    {
      'Categoría': 'Pasillos Disponibles',
      'Valores': valoresUnicos.pasillos ? valoresUnicos.pasillos.join(', ') : 'Ninguno',
      'Cantidad': valoresUnicos.pasillos ? valoresUnicos.pasillos.length : 0
    }
  ];
  
  // Generar nombre de archivo con fecha y hora
  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  const nombreArchivo = `estadisticas_posiciones_vacias_${fecha}_${hora}`;
  
  try {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Hoja de estadísticas
    const worksheetStats = XLSX.utils.json_to_sheet(datosEstadisticas);
    XLSX.utils.book_append_sheet(workbook, worksheetStats, 'Estadísticas');
    
    // Hoja de valores únicos
    const worksheetValores = XLSX.utils.json_to_sheet(datosValoresUnicos);
    XLSX.utils.book_append_sheet(workbook, worksheetValores, 'Valores Únicos');
    
    // Generar el archivo Excel
    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    
    console.log(`✅ Estadísticas exportadas a Excel: ${nombreArchivo}.xlsx`);
    return { exito: true, mensaje: 'Estadísticas exportadas exitosamente' };
  } catch (error) {
    console.error('❌ Error al exportar estadísticas:', error);
    return { exito: false, mensaje: 'Error al exportar las estadísticas' };
  }
};
