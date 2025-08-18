# Sistema de Sincronización Offline

## Descripción General

Este sistema permite que la aplicación funcione correctamente incluso cuando hay problemas de conectividad en el depósito. Las operaciones se guardan localmente y se sincronizan automáticamente cuando se restaura la conexión.

## Características Principales

### 1. **Queue de Operaciones Offline**
- Las operaciones se almacenan localmente en Redux cuando no hay conexión
- Se sincronizan automáticamente cuando se restaura la conexión
- Sistema de reintentos con límite configurable (3 intentos por defecto)

### 2. **Actualizaciones Optimistas**
- Los cambios se reflejan inmediatamente en la UI
- No es necesario esperar la respuesta del servidor
- Mejora la experiencia del usuario

### 3. **Sistema de Notificaciones**
- Notificaciones en tiempo real del estado de la conexión
- Alertas cuando las operaciones fallan
- Panel de administración para monitorear el estado

### 4. **Monitoreo de Estado**
- Indicador visual del estado de conexión
- Contador de operaciones pendientes y fallidas
- Estadísticas de sincronización

## Componentes del Sistema

### 1. **Slice de Notificaciones** (`notificacionesSlice.js`)
```javascript
// Estado principal
{
  notificaciones: [], // Lista de notificaciones
  isOnline: boolean,  // Estado de conexión
  pendingOperations: [], // Operaciones pendientes
  isSyncing: boolean  // Estado de sincronización
}
```

### 2. **Servicio de Sincronización** (`offlineSyncService.js`)
- Maneja la lógica de sincronización
- Detecta cambios de conectividad
- Ejecuta operaciones pendientes
- Gestiona reintentos

### 3. **Hooks Personalizados** (`useOfflineStock.js`)
- Proporciona funciones para operaciones offline
- Integra actualizaciones optimistas
- Maneja errores automáticamente

## Uso del Sistema

### 1. **Operaciones Básicas**

```javascript
import { useOfflineStock } from '../hooks/useOfflineStock';

const MyComponent = () => {
  const { adicionRapidaOffline, movimientoInternoOffline } = useOfflineStock();

  const handleAdicionRapida = async (data) => {
    const result = await adicionRapidaOffline(data);
    
    if (result.offline) {
      console.log('Operación guardada para sincronización posterior');
    } else {
      console.log('Operación ejecutada exitosamente');
    }
  };
};
```

### 2. **Indicador de Estado de Conexión**

```javascript
import ConnectionStatus from '../ui/ConnectionStatus';

// En cualquier componente
<ConnectionStatus showStats={true} />
```

### 3. **Panel de Notificaciones**

El panel se encuentra en la pestaña "Notificaciones" del dashboard de administración y muestra:
- Estado de conexión
- Operaciones pendientes
- Operaciones fallidas
- Historial de notificaciones
- Controles de sincronización

## Tipos de Operaciones Soportadas

### 1. **Adición Rápida**
```javascript
{
  tipo: 'adicionRapida',
  data: {
    posicionId: number,
    itemId: number,
    kilos: number,
    unidades: number
  }
}
```

### 2. **Ajuste de Stock**
```javascript
{
  tipo: 'ajusteStock',
  data: {
    posicionId: number,
    itemId: number,
    kilos: number,
    unidades: number
  }
}
```

### 3. **Movimiento Interno**
```javascript
{
  tipo: 'movimientoInterno',
  data: {
    posicionOrigenId: number,
    posicionDestinoId: number,
    itemId: number,
    kilos: number,
    unidades: number
  }
}
```

### 4. **Corrección de Item**
```javascript
{
  tipo: 'correccionItem',
  data: {
    posicionId: number,
    itemId: number,
    kilos: number,
    unidades: number
  }
}
```

## Configuración

### 1. **Intervalo de Sincronización**
Por defecto, el sistema intenta sincronizar cada 30 segundos cuando hay operaciones pendientes.

```javascript
// En offlineSyncService.js
this.syncInterval = setInterval(() => {
  // Lógica de sincronización
}, 30000); // 30 segundos
```

### 2. **Número de Reintentos**
Cada operación tiene un máximo de 3 intentos antes de marcarse como fallida.

```javascript
{
  intentos: 0,
  maxIntentos: 3
}
```

### 3. **Límite de Notificaciones**
Se mantienen las últimas 100 notificaciones para evitar problemas de memoria.

## Manejo de Errores

### 1. **Errores de Red**
- Se detectan automáticamente
- Las operaciones se guardan localmente
- Se notifica al usuario

### 2. **Errores del Servidor**
- Se reintentan automáticamente
- Se notifica al usuario después de 3 intentos fallidos
- Se pueden limpiar manualmente desde el panel

### 3. **Errores de Validación**
- Se muestran inmediatamente
- No se guardan en la queue
- Requieren corrección del usuario

## Monitoreo y Debugging

### 1. **Logs de Consola**
El sistema genera logs detallados para debugging:
- Cambios de estado de conexión
- Operaciones agregadas a la queue
- Intentos de sincronización
- Errores y fallos

### 2. **Panel de Administración**
- Vista en tiempo real del estado
- Estadísticas de sincronización
- Control manual de operaciones

### 3. **Redux DevTools**
Todo el estado se puede inspeccionar en Redux DevTools:
- Estado de notificaciones
- Operaciones pendientes
- Historial de cambios

## Mejores Prácticas

### 1. **Uso de Hooks**
Siempre usar los hooks personalizados en lugar de llamar directamente a la API:
```javascript
// ✅ Correcto
const { adicionRapidaOffline } = useOfflineStock();
await adicionRapidaOffline(data);

// ❌ Incorrecto
await stockApi.adicionRapida(data);
```

### 2. **Manejo de Estados**
Verificar el resultado de las operaciones:
```javascript
const result = await adicionRapidaOffline(data);
if (result.offline) {
  // Mostrar mensaje de "guardado localmente"
} else {
  // Mostrar mensaje de éxito
}
```

### 3. **Feedback al Usuario**
Siempre informar al usuario sobre el estado de sus operaciones:
- Cuando se guardan localmente
- Cuando se sincronizan exitosamente
- Cuando fallan permanentemente

## Extensibilidad

### 1. **Agregar Nuevas Operaciones**
1. Agregar el handler en `offlineSyncService.js`
2. Crear la función optimista en el slice
3. Agregar el hook correspondiente
4. Actualizar la documentación

### 2. **Personalizar Configuración**
- Modificar intervalos de sincronización
- Cambiar número de reintentos
- Ajustar límites de notificaciones

### 3. **Integrar con Otros Módulos**
El sistema está diseñado para ser extensible a otros módulos:
- Compras
- Remitos
- Usuarios
- Reportes

## Troubleshooting

### 1. **Operaciones No Se Sincronizan**
- Verificar estado de conexión
- Revisar logs de consola
- Comprobar operaciones pendientes en el panel

### 2. **Errores Persistentes**
- Limpiar operaciones fallidas
- Verificar configuración del servidor
- Revisar logs del servidor

### 3. **Problemas de Rendimiento**
- Reducir intervalo de sincronización
- Limpiar notificaciones antiguas
- Optimizar actualizaciones optimistas
