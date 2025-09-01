# Adición Rápida en Posiciones

## Descripción

Se ha implementado la funcionalidad de adición rápida en la página de posiciones, permitiendo agregar items directamente a una posición seleccionada sin necesidad de navegar a la página de adición rápida.

## Funcionalidades

### Componente AdicionRapidaPosicion

- **Ubicación**: `src/components/AdicionRapidaPosicion/AdicionRapidaPosicion.jsx`
- **Propósito**: Modal reutilizable para adición rápida desde posiciones
- **Características**:
  - Formulario completo con proveedor, item, partida, kilos y unidades
  - Autocompletado de proveedores e items
  - Creación de nuevos proveedores e items desde el modal
  - Validación de campos requeridos
  - Integración con la posición seleccionada

### Integración en PosicionesPage

- **Botón de Adición Rápida**: Aparece después de seleccionar una posición
- **Validación**: Solo se puede usar cuando hay una posición seleccionada
- **Flujo de trabajo**:
  1. Usuario selecciona una posición (pasillo o rack/fila/nivel)
  2. Ejecuta la búsqueda para ver los items existentes
  3. Hace clic en "Adición Rápida" para abrir el modal
  4. Completa el formulario con los datos del nuevo item
  5. El sistema agrega el item a la posición seleccionada

## Uso

### Para el Usuario

1. **Seleccionar Posición**:
   - Elegir entre pasillo O rack/fila/nivel
   - Hacer clic en "Buscar" para cargar los items existentes

2. **Abrir Adición Rápida**:
   - Hacer clic en el botón "Adición Rápida" (solo disponible después de buscar)
   - El modal se abrirá con la posición pre-seleccionada

3. **Completar Formulario**:
   - Seleccionar proveedor (o crear uno nuevo)
   - Seleccionar item (o crear uno nuevo)
   - Ingresar número de partida
   - Especificar kilos y unidades

4. **Confirmar**:
   - Hacer clic en "Agregar" para completar la operación
   - Los resultados se actualizarán automáticamente

### Para Desarrolladores

#### Importar el Componente

```javascript
import { AdicionRapidaPosicion } from '../../components/AdicionRapidaPosicion';
```

#### Usar el Componente

```javascript
<AdicionRapidaPosicion
  open={modalAdicionRapidaOpen}
  onClose={handleCerrarModalAdicionRapida}
  posicion={posicionActual}
  onSubmit={handleAdicionRapidaExitoso}
/>
```

#### Manejar el Submit

```javascript
const handleAdicionRapidaExitoso = async (adicionData) => {
  try {
    const response = await apiClient.post('/movimientos/adicion-rapida', adicionData);
    // Manejar respuesta exitosa
  } catch (error) {
    // Manejar error
  }
};
```

## Estructura de Datos

### Datos de Entrada (adicionData)

```javascript
{
  proveedor: {
    id: string,
    nombre: string
  },
  tipoMovimiento: 'ajusteSUMA',
  item: {
    itemId: string,
    categoria: string,
    descripcion: string,
    proveedor: object,
    partida: string,
    kilos: 0,
    unidades: 0
  },
  kilos: number,
  unidades: number,
  partida: string,
  posicion: string // ID de la posición
}
```

## Rutas del Backend

- **POST** `/movimientos/adicion-rapida`: Endpoint para procesar la adición rápida
- **POST** `/proveedores`: Crear nuevo proveedor
- **POST** `/items`: Crear nuevo item

## Dependencias

- **Redux**: Para manejo de estado de proveedores e items
- **Material-UI**: Componentes de interfaz
- **Axios**: Cliente HTTP para llamadas al backend
- **React**: Framework base

## Archivos Modificados

1. **Nuevos**:
   - `src/components/AdicionRapidaPosicion/AdicionRapidaPosicion.jsx`
   - `src/components/AdicionRapidaPosicion/index.js`
   - `README_ADICION_RAPIDA_POSICIONES.md`

2. **Modificados**:
   - `src/pages/PosicionesPage/PosicionesPage.jsx`

## Consideraciones

- El componente reutiliza la lógica del `AdicionRapidaForm` original
- Se mantiene la consistencia con el diseño del sistema
- La validación es la misma que en la adición rápida normal
- Se integra con el sistema de notificaciones existente
- Los datos de posición se extraen automáticamente de la posición seleccionada
