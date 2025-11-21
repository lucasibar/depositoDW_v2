# Movimientos de Mercadería

## Descripción

La funcionalidad de "Movimientos de Mercadería" es una herramienta de optimización del depósito que analiza automáticamente las posiciones y recomienda movimientos para mejorar la organización según las categorías ideales de cada posición.

## Características Principales

### 1. Análisis Automático
- Identifica posiciones de entrada con items pendientes de ubicación
- Detecta posiciones vacías disponibles
- Analiza la compatibilidad entre categorías de items y categorías ideales de posiciones

### 2. Recomendaciones Inteligentes
- **Prioridad Alta**: Items en posiciones de entrada que deben moverse a posiciones ideales
- **Prioridad Media**: Reorganización de items que están en posiciones incorrectas
- **Categorización**: Agrupa movimientos por tipo y prioridad

### 3. Interfaz de Usuario
- **Dashboard con estadísticas**: Resumen visual de la situación del depósito
- **Tab de Posiciones de Entrada**: Muestra todos los items que están en posiciones de entrada
- **Tab de Movimientos Recomendados**: Lista detallada de todos los movimientos sugeridos

## Estructura de Archivos

```
MovimientosMercaderiaPage/
├── MovimientosMercaderiaPage.jsx     # Página principal
├── index.js                          # Export del componente
├── components/
│   ├── PosicionesEntradaTab.jsx      # Tab de posiciones de entrada
│   └── MovimientosRecomendadosTab.jsx # Tab de movimientos recomendados
└── README.md                         # Esta documentación
```

## Lógica de Negocio

### Algoritmo de Recomendaciones

1. **Identificación de Posiciones de Entrada**
   - Busca posiciones con `entrada: true`
   - Calcula el stock disponible en cada posición

2. **Identificación de Posiciones Vacías**
   - Encuentra posiciones sin stock disponible
   - Agrupa por categoría ideal

3. **Generación de Movimientos**
   - **Desde Entrada**: Items en posiciones de entrada → Posiciones ideales vacías
   - **Reorganización**: Items en posiciones incorrectas → Posiciones ideales vacías

4. **Priorización**
   - Alta: Movimientos desde entrada (máxima prioridad)
   - Media: Reorganizaciones internas

### Categorías Soportadas

El sistema reconoce las siguientes categorías de items:
- costura
- algodon
- algodon-color
- nylon
- nylon-color
- lycra
- lycra REC
- goma
- tarugo
- etiqueta
- bolsa
- percha
- ribbon
- caja
- cinta
- plantilla
- film
- consumibles
- poliester
- nylon REC

## API Endpoints

### Backend
- `GET /posiciones/recomendaciones-movimientos` - Obtiene las recomendaciones de movimientos

### Respuesta de la API
```json
{
  "posicionesEntrada": [
    {
      "id": "uuid",
      "entrada": true,
      "categoria_ideal": null,
      "items": [
        {
          "item": { "id": "uuid", "descripcion": "...", "categoria": "..." },
          "partida": { "id": "uuid", "numeroPartida": 123 },
          "proveedor": { "id": "uuid", "nombre": "..." },
          "kilos": 10.5,
          "unidades": 100
        }
      ]
    }
  ],
  "movimientosRecomendados": [
    {
      "tipo": "entrada_a_ideal" | "reorganizacion",
      "prioridad": "alta" | "media" | "baja",
      "item": { ... },
      "partida": { ... },
      "proveedor": { ... },
      "kilos": 10.5,
      "unidades": 100,
      "posicionOrigen": { ... },
      "posicionDestino": { ... },
      "categoria": "algodon",
      "razon": "Mover desde entrada a posición ideal para categoría algodon"
    }
  ],
  "estadisticas": {
    "totalPosiciones": 560,
    "posicionesEntrada": 1,
    "posicionesVacias": 45,
    "itemsEnEntrada": 12,
    "movimientosRecomendados": 8,
    "movimientosEntrada": 5,
    "movimientosReorganizacion": 3,
    "posicionesVaciasPorCategoria": {
      "algodon": 5,
      "nylon": 3,
      "costura": 2
    }
  },
  "fechaGeneracion": "2024-01-15T10:30:00.000Z"
}
```

## Permisos de Acceso

- **Admin**: Acceso completo
- **Depósito**: Acceso completo
- **Otros roles**: Sin acceso

## Uso

1. Navegar a "Movimientos Mercadería" desde el menú lateral
2. Revisar las estadísticas en el dashboard
3. Examinar las posiciones de entrada en la primera tab
4. Revisar los movimientos recomendados en la segunda tab
5. Usar los filtros para encontrar movimientos específicos
6. Expandir los detalles de cada movimiento para ver información completa

## Beneficios

- **Optimización del espacio**: Mejor utilización de las posiciones del depósito
- **Eficiencia operativa**: Reducción del tiempo de búsqueda de items
- **Organización por categorías**: Agrupación lógica de materiales similares
- **Visibilidad**: Dashboard claro del estado actual del depósito
- **Automatización**: Recomendaciones automáticas sin intervención manual

## Consideraciones Técnicas

- Los datos se actualizan en tiempo real al hacer clic en "Actualizar"
- Los filtros permiten búsqueda por múltiples criterios
- La interfaz es responsive y funciona en dispositivos móviles
- Los movimientos se priorizan automáticamente según la lógica de negocio
