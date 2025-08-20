# Funcionalidad de Adición Rápida

## Descripción
La funcionalidad de Adición Rápida permite agregar múltiples registros de stock de manera eficiente, generando automáticamente movimientos de ajuste SUMA en la base de datos.

## Características Implementadas

### Frontend (React + Redux)
- **Carga automática de datos**: Al cargar la página, se obtienen automáticamente proveedores e items desde `/remitos/dataload-remito-recepcion`
- **Autocomplete inteligente**: 
  - Select de proveedores con búsqueda por nombre
  - Select de items filtrado por proveedor seleccionado, con búsqueda en categoría y descripción
- **Formulario responsivo**: Campos compactos que se adaptan al tamaño de pantalla
- **Validación en tiempo real**: El botón de agregar se habilita solo cuando el formulario está completo
- **Tabla de registros**: Muestra todos los registros agregados con opción de eliminar individualmente
- **Envío al backend**: Botón para enviar todos los registros al servidor

### Backend (NestJS)
- **Endpoint**: `POST /posiciones/adicion_rapida`
- **DTO**: Validación de datos de entrada con class-validator
- **Procesamiento**: 
  - Búsqueda de proveedores por nombre
  - Búsqueda de items por categoría, descripción y proveedor
  - Creación automática de partidas si no existen
  - Búsqueda de posiciones por rack, fila, nivel y pasillo
  - Generación de movimientos de tipo `ajusteSUMA`
- **Respuesta detallada**: Incluye registros exitosos, errores y estadísticas

## Estructura de Datos

### Registro de Adición Rápida
```typescript
{
  proveedor: string;      // Nombre del proveedor
  item: string;          // Formato: "categoria - descripcion"
  partida: string;       // Número de partida
  kilos: number;         // Cantidad en kilos
  unidades: number;      // Cantidad en unidades
  rack: string;          // Número de rack
  fila: string;          // Número de fila
  nivel: string;         // Nivel A o B
  pasillo: string;       // Número de pasillo
}
```

### Movimiento Generado
```typescript
{
  tipoMovimiento: 'ajusteSUMA';
  partida: Partidas;
  kilos: number;
  unidades: number;
  item: Items;
  posicion: Posiciones;
  proveedor: Proveedores;
  fecha: string;
}
```

## Flujo de Trabajo

1. **Carga inicial**: La página carga proveedores e items automáticamente
2. **Selección de proveedor**: Usuario selecciona un proveedor del autocomplete
3. **Selección de item**: Se filtran los items por el proveedor seleccionado
4. **Completar formulario**: Usuario llena los campos restantes (partida, kilos, unidades, posición)
5. **Agregar registro**: Se agrega el registro a la tabla local
6. **Repetir proceso**: Usuario puede agregar múltiples registros
7. **Envío al servidor**: Al hacer clic en "Enviar Registros", se envían todos los registros al backend
8. **Procesamiento**: El backend procesa cada registro y genera los movimientos correspondientes
9. **Respuesta**: Se muestra el resultado del procesamiento (éxitos y errores)

## Manejo de Errores

### Frontend
- Validación de formulario en tiempo real
- Mensajes de error específicos para cada campo
- Indicadores de loading durante las operaciones
- Manejo de errores de red con mensajes informativos

### Backend
- Validación de datos de entrada con DTOs
- Búsqueda de entidades relacionadas (proveedor, item, posición)
- Creación automática de partidas si no existen
- Respuesta detallada con errores específicos por registro
- Manejo de transacciones para garantizar consistencia

## Archivos Principales

### Frontend
- `src/pages/AdicionRapidaPage/AdicionRapidaPage.jsx` - Página principal
- `src/features/adicionesRapidas/model/slice.js` - Estado Redux
- `src/features/adicionesRapidas/model/thunks.js` - Operaciones asíncronas
- `src/shared/ui/AutocompleteSelect/AutocompleteSelect.jsx` - Componente de autocomplete
- `src/features/adicionesRapidas/hooks/useAdicionRapida.js` - Lógica de filtrado

### Backend
- `src/posiciones/posiciones.controller.ts` - Controlador del endpoint
- `src/posiciones/posiciones.service.ts` - Lógica de negocio
- `src/posiciones/dto/adicion-rapida.dto.ts` - Validación de datos
- `src/movimientos/movimientos-consulta-rapida.entity.ts` - Entidad de movimientos

## Mejoras Futuras

1. **Validación de stock**: Verificar disponibilidad antes de agregar
2. **Historial de operaciones**: Guardar logs de todas las adiciones rápidas
3. **Importación masiva**: Permitir importar registros desde archivos CSV/Excel
4. **Notificaciones**: Sistema de notificaciones para operaciones exitosas/fallidas
5. **Reportes**: Generar reportes de adiciones rápidas por período
6. **Permisos**: Control de acceso basado en roles de usuario
