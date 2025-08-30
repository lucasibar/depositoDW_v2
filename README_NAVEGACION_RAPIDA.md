# Navegación Rápida Completa: Stock ↔ Materiales ↔ Posiciones

## Descripción

Esta funcionalidad permite a los usuarios hacer click en las cartas de stock, materiales y posiciones para acceder rápidamente a información detallada y ejecutar búsquedas automáticas en las páginas correspondientes, creando un flujo de navegación bidireccional completo.

## Funcionalidades

### 1. Click en Cartas de Stock → Materiales
- Al hacer click en cualquier carta de stock, se activa la funcionalidad de navegación rápida
- Se extrae automáticamente la información del material (item, proveedor, partida, etc.)
- Navegación inteligente según el rol del usuario

### 2. Click en Cartas de Materiales → Posiciones
- Al hacer click en cualquier carta de posición en materiales, se navega a la página de posiciones
- Se extrae automáticamente la información de la posición (rack/fila/nivel o pasillo)
- Se ejecuta automáticamente la búsqueda en posiciones

### 3. Click en Cartas de Posiciones → Stock ⭐ NUEVO
- Al hacer click en cualquier carta de item en posiciones, se navega a la página de stock
- Se extrae automáticamente la información del item (categoría, descripción)
- Se ejecuta automáticamente la búsqueda en stock

### 4. Navegación Inteligente por Rol
- **Stock → Materiales**: Solo usuarios con roles `['deposito', 'usuario', 'admin']` pueden acceder directamente
- **Materiales → Posiciones**: Solo usuarios con roles `['deposito', 'admin']` pueden acceder directamente
- **Posiciones → Stock**: Solo usuarios con roles `['deposito', 'usuario', 'admin']` pueden acceder directamente
- **Otros roles**: Ven modales con información detallada y opciones de navegación

### 5. Búsquedas Automáticas
- **En Materiales**: Se pre-llena el formulario con item y proveedor del material seleccionado
- **En Posiciones**: Se pre-llena el formulario con rack/fila/nivel o pasillo de la posición seleccionada
- **En Stock**: Se ejecuta automáticamente la búsqueda con categoría y descripción del item
- **Resultados**: Se muestran inmediatamente sin necesidad de re-ingresar información

## Componentes Implementados

### 1. Hook `useNavegacionRapida`
- Maneja la lógica de navegación rápida desde stock a materiales
- Configura el estado de Redux para la búsqueda automática
- Determina la ruta de destino según el rol del usuario

### 2. Hook `useNavegacionRapidaPosiciones`
- Maneja la lógica de navegación rápida desde materiales a posiciones
- Configura el estado de Redux para la búsqueda automática en posiciones
- Determina la ruta de destino según el rol del usuario

### 3. Hook `useNavegacionRapidaStock` ⭐ NUEVO
- Maneja la lógica de navegación rápida desde posiciones a stock
- Configura el estado de Redux para la búsqueda automática en stock
- Determina la ruta de destino según el rol del usuario

### 4. Modal `MaterialDetailModal`
- Muestra información detallada del material para usuarios sin acceso directo
- Incluye datos del item, stock, partida y proveedor
- Botón para navegar a materiales (solo si el usuario tiene permisos)

### 5. Estado de Redux
- `navegacionRapida`: Para navegación desde stock a materiales
- `navegacionRapidaPosiciones`: Para navegación desde materiales a posiciones
- `navegacionRapidaStock`: Para navegación desde posiciones a stock ⭐ NUEVO

## Flujo de Uso Completo

### Para Usuarios con Acceso Completo:
1. **Stock → Materiales**: Click en carta de stock → Navegación automática a materiales → Búsqueda automática ejecutada
2. **Materiales → Posiciones**: Click en carta de posición → Navegación automática a posiciones → Búsqueda automática ejecutada
3. **Posiciones → Stock**: Click en carta de item → Navegación automática a stock → Búsqueda automática ejecutada ⭐ NUEVO

### Para Usuarios con Acceso Limitado:
1. **Stock**: Click en carta → Modal con detalles del material
2. **Materiales**: Click en carta → Modal con detalles de la posición (si tienen permisos)
3. **Posiciones**: Click en carta → Modal con detalles del item (si tienen permisos) ⭐ NUEVO

## Archivos Modificados

- `src/features/adicionesRapidas/model/slice.js` - Estados para todas las navegaciones rápidas
- `src/features/adicionesRapidas/model/selectors.js` - Selectores para todos los estados
- `src/features/adicionesRapidas/hooks/useNavegacionRapida.js` - Hook para stock → materiales
- `src/features/adicionesRapidas/hooks/useNavegacionRapidaPosiciones.js` - Hook para materiales → posiciones
- `src/features/adicionesRapidas/hooks/useNavegacionRapidaStock.js` - Hook para posiciones → stock ⭐ NUEVO
- `src/features/compras/hooks/useComprasActions.js` - Lógica de click en materiales de stock
- `src/pages/ComprasPage/components/StockTab/StockTab.jsx` - Integración del modal y búsqueda automática
- `src/pages/MaterialesPage/MaterialesPage.jsx` - Procesamiento de navegación rápida y click en posiciones
- `src/pages/PosicionesPage/PosicionesPage.jsx` - Procesamiento de navegación rápida y click en items ⭐ NUEVO
- `src/features/stock/hooks/useStockData.js` - Búsqueda automática en stock ⭐ NUEVO
- `src/shared/ui/MaterialDetailModal/` - Modal de detalles del material

## Beneficios

1. **Acceso Rápido**: Un click desde cualquier carta lleva directamente a la información relevante
2. **Experiencia Unificada**: Mismo flujo de trabajo para todos los usuarios
3. **Búsquedas Automáticas**: No es necesario re-ingresar información
4. **Control de Acceso**: Respeta los permisos de usuario del sistema
5. **Información Completa**: Modales muestran todos los datos relevantes
6. **Navegación Bidireccional Completa**: Flujo completo desde stock → materiales → posiciones → stock ⭐ NUEVO
7. **Ciclo Cerrado**: Los usuarios pueden navegar en ambas direcciones entre todas las secciones

## Uso Técnico

### Para Desarrolladores:
```javascript
// Navegación desde stock a materiales
import { useNavegacionRapida } from '../features/adicionesRapidas/hooks/useNavegacionRapida';
const { navegarAMaterialesConBusqueda } = useNavegacionRapida();
navegarAMaterialesConBusqueda(materialData);

// Navegación desde materiales a posiciones
import { useNavegacionRapidaPosiciones } from '../features/adicionesRapidas/hooks/useNavegacionRapidaPosiciones';
const { navegarAPosicionesConBusqueda } = useNavegacionRapidaPosiciones();
navegarAPosicionesConBusqueda(resultadoData);

// Navegación desde posiciones a stock ⭐ NUEVO
import { useNavegacionRapidaStock } from '../features/adicionesRapidas/hooks/useNavegacionRapidaStock';
const { navegarAStockConBusqueda } = useNavegacionRapidaStock();
navegarAStockConBusqueda(resultadoData);
```

### Para Usuarios:
1. **Stock**: Ir a Stock → Click en carta de material → Seguir opciones según rol
2. **Materiales**: Ir a Materiales → Buscar item → Click en carta de posición → Seguir opciones según rol
3. **Posiciones**: Ir a Posiciones → Buscar posición → Click en carta de item → Seguir opciones según rol ⭐ NUEVO

## Consideraciones Técnicas

- Los estados de navegación rápida se limpian automáticamente después de su uso
- La funcionalidad es compatible con el sistema de autenticación existente
- Se mantiene la consistencia con el diseño del sistema
- Responsive design para dispositivos móviles
- Integración completa con Redux y React Router
- Manejo inteligente de diferentes tipos de posición (rack/fila/nivel vs pasillo)
- Prevención de conflictos entre navegaciones rápidas simultáneas
- Búsqueda automática en stock basada en categoría y descripción del item ⭐ NUEVO

## Flujo de Datos Completo

### Stock → Materiales:
```
Carta Stock → Extraer item/proveedor → Redux state → Navegar a Materiales → 
Pre-llenar formulario → Ejecutar búsqueda → Mostrar resultados
```

### Materiales → Posiciones:
```
Carta Posición → Extraer rack/fila/nivel o pasillo → Redux state → 
Navegar a Posiciones → Pre-llenar formulario → Ejecutar búsqueda → Mostrar resultados
```

### Posiciones → Stock ⭐ NUEVO:
```
Carta Item → Extraer categoría/descripción → Redux state → 
Navegar a Stock → Ejecutar búsqueda automática → Mostrar resultados filtrados
```

## Permisos por Rol

| Rol | Stock → Materiales | Materiales → Posiciones | Posiciones → Stock |
|-----|-------------------|-------------------------|-------------------|
| `admin` | ✅ Directo | ✅ Directo | ✅ Directo |
| `deposito` | ✅ Directo | ✅ Directo | ✅ Directo |
| `usuario` | ✅ Directo | ❌ Modal | ✅ Directo |
| `compras` | ❌ Modal | ❌ Modal | ❌ Modal |
| `calidad` | ❌ Modal | ❌ Modal | ❌ Modal |
| `salida` | ❌ Modal | ❌ Modal | ❌ Modal |

## Ciclo de Navegación Completo ⭐ NUEVO

```
Stock → Materiales → Posiciones → Stock
  ↓         ↓           ↓         ↓
Click    Click      Click      Búsqueda
Carta    Carta      Carta      Automática
```

Ahora los usuarios pueden navegar en ambas direcciones entre todas las secciones del sistema, creando una experiencia de usuario fluida y eficiente.
