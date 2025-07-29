# Configuración de Variables de Entorno

## Archivo .env

Para configurar la URL del servidor, crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
REACT_APP_API_URL=https://derwill-deposito-backend.onrender.com
```

## URLs del Servidor

### Producción
- **URL**: `https://derwill-deposito-backend.onrender.com`
- **Descripción**: Servidor de producción desplegado en Render

### Desarrollo Local (Opcional)
Si quieres usar un servidor local para desarrollo, puedes cambiar la URL:

```env
REACT_APP_API_URL=http://localhost:3000
```

## Configuración Centralizada

El proyecto usa una configuración centralizada en `src/config/api.js` que incluye:

- **BASE_URL**: URL del servidor (desde variables de entorno)
- **TIMEOUT**: Timeout para peticiones (30 segundos)
- **DEFAULT_HEADERS**: Headers por defecto

## Endpoints Disponibles

### Stock
- `GET /stock/total/:idItem` - Stock total de un item
- `GET /stock/:idItem` - Stock detallado de un item
- `POST /stock/posicion` - Stock por posición

### Movimientos
- `GET /movimientos/entrada` - Movimientos de entrada
- `GET /movimientos/salida` - Movimientos de salida
- `GET /movimientos/sin-remito` - Salidas sin remito asignado

### Items
- `GET /items` - Todos los items
- `GET /items/:idProveedor` - Items por proveedor
- `POST /items` - Crear item

### Proveedores
- `GET /proveedores` - Todos los proveedores
- `GET /proveedores/:idProveedor` - Items de un proveedor
- `POST /proveedores` - Crear proveedor

### Remitos
- `GET /remitos/dataload-remito-recepcion` - Datos de remitos de recepción

## Notas Importantes

1. **Variables de Entorno**: React requiere que las variables de entorno empiecen con `REACT_APP_`
2. **Reinicio**: Después de crear/modificar el archivo `.env`, reinicia el servidor de desarrollo
3. **Git**: El archivo `.env` no se incluye en el repositorio por seguridad
4. **Fallback**: Si no se define `REACT_APP_API_URL`, se usa la URL de producción por defecto

## Ejemplo de Uso

```javascript
import { API_CONFIG } from '../config/api';

// La URL se obtiene automáticamente de la configuración
console.log(API_CONFIG.BASE_URL); // https://derwill-deposito-backend.onrender.com
``` 