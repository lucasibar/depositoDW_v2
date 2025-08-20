# Problemas Identificados en la Página de Depósito

## Problemas Encontrados

### 1. **Movimiento Interno**
- **Problema**: El hook `useOptimizedMovements` estaba buscando `data.posicionDestinoId` que no existe en la estructura de datos enviada por el formulario.
- **Causa**: El formulario envía datos de ubicación (rack, fila, nivel o pasillo) pero el hook esperaba un ID directo de posición.
- **Solución**: Modificado el hook para buscar la posición destino basada en los datos de ubicación enviados.

### 2. **Ajuste de Stock (Corrección)**
- **Problema**: El formulario estaba enviando los kilos y unidades totales del item en lugar de las cantidades a eliminar.
- **Causa**: Confusión en la estructura de datos entre el item completo y las cantidades a ajustar.
- **Solución**: Corregido para enviar las cantidades específicas a eliminar.

### 3. **Estructura de Datos Inconsistente**
- **Problema**: Los formularios no estaban enviando los datos en el formato exacto que espera el backend.
- **Causa**: Falta de validación y debug en el frontend.
- **Solución**: Agregado sistema de debug y validación de datos.

## Cambios Implementados

### 1. **Archivo de Debug (`src/features/stock/utils/debugUtils.js`)**
- Agregadas funciones de logging para cada operación
- Implementada validación de estructura de datos
- Mensajes de error detallados

### 2. **Hook Optimizado (`src/features/stock/hooks/useOptimizedMovements.js`)**
- Agregado debug y validación antes de cada operación
- Corregida lógica de búsqueda de posición destino en movimiento interno
- Mejorado manejo de errores

### 3. **Formulario de Corrección (`src/widgets/remitos/CorreccionForm/CorreccionForm.jsx`)**
- Corregida estructura de datos enviada al backend
- Agregado logging para debug
- Asegurado que se envíen las cantidades correctas a eliminar

### 4. **Formulario de Movimiento Interno (`src/widgets/remitos/MovimientoInternoForm/MovimientoInternoForm.jsx`)**
- Corregida estructura de datos enviada al backend
- Agregado logging para debug
- Asegurado que se envíen los IDs correctos

## Estructura de Datos Esperada por el Backend

### Movimiento Interno
```javascript
{
  selectedItem: {
    itemId: string,
    categoria: string,
    descripcion: string,
    proveedor: object,
    partida: string,
    kilos: number,
    unidades: number
  },
  data: {
    pasillo?: number,        // O
    rack?: number,           // O
    fila?: number,           // O
    nivel?: string           // O
  },
  id: string  // ID de la posición origen
}
```

### Ajuste de Stock
```javascript
{
  proveedor: object,
  tipoMovimiento: 'ajusteRESTA',
  item: {
    itemId: string,
    categoria: string,
    descripcion: string,
    proveedor: object,
    partida: string,
    kilos: number,      // Cantidad a eliminar
    unidades: number    // Cantidad a eliminar
  },
  kilos: number,        // Cantidad a eliminar
  unidades: number,     // Cantidad a eliminar
  partida: string,
  posicion: string      // ID de la posición
}
```

## Cómo Probar las Correcciones

1. **Abrir la consola del navegador** para ver los logs de debug
2. **Intentar hacer un movimiento interno** - debería mostrar logs detallados
3. **Intentar hacer un ajuste de stock** - debería mostrar logs detallados
4. **Verificar que las operaciones se completen exitosamente**

## Próximos Pasos

1. **Probar las correcciones** en un entorno de desarrollo
2. **Verificar que los logs de debug** muestren la información correcta
3. **Confirmar que las operaciones** se completen sin errores
4. **Remover los logs de debug** una vez confirmado que todo funciona

## Notas Importantes

- Los logs de debug están activos para ayudar a identificar problemas
- La validación de datos previene errores en el backend
- Las actualizaciones optimistas mejoran la experiencia del usuario
- El sistema de notificaciones informa sobre errores de manera clara
