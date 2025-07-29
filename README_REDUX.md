# Implementación de Redux Toolkit en depositoDW_v2

## Cambios Realizados

### 1. Configuración de Redux Toolkit

Se ha implementado Redux Toolkit en el proyecto `depositoDW_v2` siguiendo el patrón de arquitectura del proyecto `deposito_dw_front`.

#### Archivos de Configuración:
- `src/app/providers/store.js` - Configuración del store de Redux
- `src/app/providers/StoreProvider.jsx` - Provider para envolver la aplicación

### 2. Slices Implementados

Se han creado los siguientes slices para la funcionalidad de compras:

#### Compras
- **Archivo**: `src/features/compras/model/slice.js`
- **API**: `src/features/compras/api/comprasApi.js`
- **Selectores**: `src/features/compras/model/selectors.js`
- **Funcionalidad**: Gestión de compras

#### Stock
- **Archivo**: `src/features/stock/model/slice.js`
- **API**: `src/features/stock/api/stockApi.js`
- **Selectores**: `src/features/stock/model/selectors.js`
- **Funcionalidad**: Gestión de stock y materiales

#### Remitos
- **Archivo**: `src/features/remitos/model/slice.js`
- **API**: `src/features/remitos/api/remitosApi.js`
- **Selectores**: `src/features/remitos/model/selectors.js`
- **Funcionalidad**: Gestión de remitos

#### Órdenes de Compra
- **Archivo**: `src/features/ordenesCompra/model/slice.js`
- **API**: `src/features/ordenesCompra/api/ordenesCompraApi.js`
- **Selectores**: `src/features/ordenesCompra/model/selectors.js`
- **Funcionalidad**: Gestión de órdenes de compra

#### Presupuesto
- **Archivo**: `src/features/presupuesto/model/slice.js`
- **API**: `src/features/presupuesto/api/presupuestoApi.js`
- **Selectores**: `src/features/presupuesto/model/selectors.js`
- **Funcionalidad**: Gestión de presupuestos

### 3. Componentes Actualizados

Todos los componentes de las pestañas de la página de compras han sido actualizados para usar Redux:

- `StockTab.jsx` - Ahora usa `useDispatch` y `useSelector` para manejar el estado
- `RemitosTab.jsx` - Implementa funcionalidad básica con Redux
- `OrdenesCompraTab.jsx` - Implementa funcionalidad básica con Redux
- `PresupuestoTab.jsx` - Implementa funcionalidad básica con Redux

### 4. Características Implementadas

#### Estado Global
- Gestión centralizada del estado de la aplicación
- Manejo de estados de carga (loading)
- Manejo de errores
- Estados de selección para elementos específicos

#### Async Thunks
- `fetchCompras` - Cargar lista de compras
- `createCompra` - Crear nueva compra
- `fetchStock` - Cargar stock de materiales
- `fetchRemitos` - Cargar lista de remitos
- `createRemito` - Crear nuevo remito
- `fetchOrdenesCompra` - Cargar órdenes de compra
- `createOrdenCompra` - Crear nueva orden de compra
- `fetchPresupuesto` - Cargar presupuestos
- `createPresupuesto` - Crear nuevo presupuesto

#### Selectores
- Selectores optimizados para cada slice
- Acceso a estados de carga y error
- Selección de elementos específicos

### 5. Configuración de API

Todos los archivos de API están configurados para usar la variable de entorno `REACT_APP_API_URL` con fallback a `http://localhost:3000`.

### 6. Uso

Para usar la funcionalidad de Redux en los componentes:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchStock } from '../features/stock/model/slice';
import { selectStock, selectStockLoading } from '../features/stock/model/selectors';

const MyComponent = () => {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isLoading = useSelector(selectStockLoading);

  useEffect(() => {
    dispatch(fetchStock());
  }, [dispatch]);

  // ... resto del componente
};
```

### 7. Próximos Pasos

1. **Implementar formularios de creación** para cada entidad
2. **Agregar validaciones** en los slices
3. **Implementar actualización y eliminación** de elementos
4. **Agregar filtros y búsquedas avanzadas**
5. **Implementar paginación** para listas grandes
6. **Agregar notificaciones** para acciones exitosas/fallidas

### 8. Dependencias

El proyecto ya incluye todas las dependencias necesarias:
- `@reduxjs/toolkit`
- `react-redux`
- `axios` (para las llamadas a la API) 