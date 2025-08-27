# Dashboard de Compras - Frontend

## Descripción

El frontend del Dashboard de Compras es una interfaz moderna y responsiva que permite visualizar y configurar el stock consolidado de diferentes tipos de materiales mediante tarjetas informativas.

## Características del Frontend

### 🎨 **Diseño Moderno**
- Tarjetas con diseño Material Design
- Colores diferenciados por categoría de material
- Iconos emoji para cada tipo de material
- Animaciones suaves y efectos hover
- Diseño completamente responsivo

### 📱 **Responsive Design**
- Adaptable a móviles, tablets y desktop
- Grid responsive que se ajusta automáticamente
- Navegación optimizada para touch
- FAB (Floating Action Button) en móviles

### ⚡ **Funcionalidades**
- Visualización en tiempo real del stock
- Configuración de items por tarjeta
- Filtrado por proveedor
- Selección múltiple de items
- Notificaciones con Snackbar
- Actualización automática de datos

## Estructura de Archivos

```
src/
├── components/
│   ├── DashboardComprasCard/
│   │   ├── DashboardComprasCard.jsx
│   │   ├── DashboardComprasCard.module.css
│   │   └── index.js
│   └── ConfiguracionTarjetaModal/
│       ├── ConfiguracionTarjetaModal.jsx
│       └── index.js
├── pages/
│   └── DashboardComprasPage/
│       └── DashboardComprasPage.jsx
├── services/
│   └── dashboardComprasService.js
└── app/
    └── App.jsx (ruta agregada)
```

## Componentes Principales

### 1. DashboardComprasCard
**Ubicación**: `src/components/DashboardComprasCard/`

**Funcionalidades**:
- Muestra stock en kilos y unidades
- Colores diferenciados por categoría
- Iconos específicos por material
- Botón de configuración
- Estados de carga
- Información de items configurados

**Props**:
```javascript
{
  tarjeta: {
    id: string,
    nombreTarjeta: string,
    categoria: string,
    color: string,
    stockKilos: number,
    stockUnidades: number,
    itemIds: string[]
  },
  onClick: function,
  onConfigClick: function,
  isLoading: boolean
}
```

### 2. ConfiguracionTarjetaModal
**Ubicación**: `src/components/ConfiguracionTarjetaModal/`

**Funcionalidades**:
- Selector de proveedor
- Lista de items con checkboxes
- Selección múltiple
- Vista previa de items configurados
- Validación y manejo de errores
- Estados de carga

**Props**:
```javascript
{
  open: boolean,
  onClose: function,
  tarjeta: object,
  onConfiguracionGuardada: function
}
```

### 3. DashboardComprasPage
**Ubicación**: `src/pages/DashboardComprasPage/`

**Funcionalidades**:
- Página principal del dashboard
- Grid responsivo de tarjetas
- Manejo de estados globales
- Integración con servicios
- Navegación y layout

## Servicios

### dashboardComprasService
**Ubicación**: `src/services/dashboardComprasService.js`

**Métodos disponibles**:
- `obtenerDashboard()` - Obtiene todas las tarjetas con stock
- `obtenerProveedores()` - Lista de proveedores
- `obtenerItemsPorProveedor(proveedorId)` - Items de un proveedor
- `actualizarConfiguracion(tarjetaId, itemIds)` - Guarda configuración
- `crearConfiguracion(nombre, categoria, color, itemIds)` - Crea nueva tarjeta
- `eliminarConfiguracion(tarjetaId)` - Elimina tarjeta

## Rutas

### Nueva Ruta Agregada
```
/depositoDW_v2/dashboard-compras
```

**Acceso**: Solo usuarios con rol `compras` o `admin`

**Navegación**: Agregada al menú lateral en la sección "Operaciones"

## Colores por Categoría

- **Algodón**: Verde (#4CAF50)
- **Nylon**: Azul (#2196F3)
- **Goma**: Naranja (#FF9800)
- **Lycra**: Púrpura (#9C27B0)

## Iconos por Categoría

- **Algodón**: 🧵
- **Nylon**: 🧶
- **Goma**: 🔗
- **Lycra**: 🎽

## Estados de la Aplicación

### Loading States
- Carga inicial del dashboard
- Carga de proveedores
- Carga de items por proveedor
- Guardado de configuración

### Error States
- Error de conexión con API
- Error al cargar datos
- Error al guardar configuración

### Success States
- Configuración guardada exitosamente
- Datos actualizados correctamente

## Integración con Backend

### Endpoints Utilizados
- `GET /dashboard-compras` - Dashboard principal
- `GET /dashboard-compras/proveedores` - Lista de proveedores
- `GET /dashboard-compras/proveedores/:id/items` - Items por proveedor
- `PUT /dashboard-compras/configuraciones/:id` - Actualizar configuración

### Manejo de Errores
- Try-catch en todas las llamadas API
- Mensajes de error user-friendly
- Reintentos automáticos en caso de fallo
- Estados de carga para mejor UX

## Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Adaptaciones por Dispositivo

**Mobile**:
- Grid de 1 columna
- FAB para refresh
- Modal a pantalla completa
- Navegación simplificada

**Tablet**:
- Grid de 2 columnas
- Modal responsive
- Navegación optimizada

**Desktop**:
- Grid de 4 columnas
- Modal con tamaño óptimo
- Navegación completa

## Notificaciones

### Snackbar
- Posición: Bottom-right
- Duración: 4 segundos
- Tipos: success, error, warning, info
- Auto-hide con opción de cerrar manual

## Optimizaciones

### Performance
- Lazy loading de componentes
- Debounce en búsquedas
- Caché de datos de proveedores
- Optimización de re-renders

### UX/UI
- Animaciones suaves
- Estados de carga claros
- Feedback visual inmediato
- Navegación intuitiva

## Próximas Mejoras

1. **Filtros Avanzados**: Por fecha, proveedor, categoría
2. **Exportación**: PDF, Excel de datos
3. **Gráficos**: Visualización de tendencias
4. **Notificaciones Push**: Alertas de stock bajo
5. **Modo Offline**: Funcionalidad básica sin conexión
6. **Temas**: Modo oscuro/claro
7. **Accesibilidad**: Mejoras para lectores de pantalla

## Instalación y Uso

1. **Verificar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar API**:
   - Verificar `src/config/api.js`
   - Asegurar que el backend esté corriendo

3. **Ejecutar aplicación**:
   ```bash
   npm start
   ```

4. **Acceder al dashboard**:
   - URL: `http://localhost:3000/depositoDW_v2/dashboard-compras`
   - Login con usuario de rol `compras` o `admin`

## Troubleshooting

### Problemas Comunes

1. **No se cargan las tarjetas**:
   - Verificar que el backend esté corriendo
   - Ejecutar script de inicialización
   - Revisar logs de consola

2. **Error de CORS**:
   - Verificar configuración de API
   - Revisar headers del backend

3. **No aparecen proveedores**:
   - Verificar datos en base de datos
   - Revisar endpoint de proveedores

4. **Modal no se abre**:
   - Verificar permisos de usuario
   - Revisar logs de JavaScript
