# Feature: Partidas

Esta feature maneja toda la lógica relacionada con las partidas en el sistema de calidad.

## Estructura

```
partidas/
├── api/                    # Llamadas a la API
├── constants/              # Constantes de la feature
├── hooks/                  # Hooks personalizados
├── model/                  # Estado y lógica de negocio (Redux)
├── ui/                     # Componentes de UI
└── README.md              # Esta documentación
```

## Componentes

### UI Components

- **PartidaCard**: Tarjeta que muestra información de una partida y sus acciones
- **CalidadTabs**: Pestañas para navegar entre partidas en cuarentena y aprobadas
- **TabPanel**: Contenedor para el contenido de cada pestaña
- **EmptyState**: Estado vacío cuando no hay partidas para mostrar

### Hooks

- **useCalidadActions**: Maneja todas las acciones de calidad (aprobar, rechazar, volver a cuarentena)
- **usePartidasFilter**: Maneja el filtrado de partidas por término de búsqueda

## Constantes

- **PARTIDA_ESTADOS**: Estados posibles de una partida
- **SNACKBAR_MESSAGES**: Mensajes para las notificaciones
- **EMPTY_STATE_MESSAGES**: Mensajes para estados vacíos

## Uso

```jsx
import { 
  PartidaCard, 
  CalidadTabs, 
  TabPanel, 
  EmptyState 
} from '../../features/partidas/ui';
import { 
  useCalidadActions, 
  usePartidasFilter 
} from '../../features/partidas/hooks';

// En tu componente
const { loading, handleAprobarPartida } = useCalidadActions();
const { filteredPartidas, handleSearch } = usePartidasFilter(partidas);
```

## Principios de Clean Code Aplicados

1. **Separación de Responsabilidades**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Componentes modulares que se pueden reutilizar
3. **Nombres Descriptivos**: Variables y funciones con nombres claros
4. **Funciones Pequeñas**: Cada función hace una cosa específica
5. **Constantes**: Valores mágicos extraídos a constantes
6. **Hooks Personalizados**: Lógica reutilizable encapsulada en hooks
7. **Componentes Presentacionales**: Separación entre lógica y presentación 