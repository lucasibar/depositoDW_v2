# 🎨 Sistema de Diseño - Der Will

## 📋 Descripción General

Este documento describe el sistema de diseño implementado para el sistema de gestión de depósito "Der Will". El diseño está optimizado para ser **coherente**, **moderno** y **completamente responsive** para móvil, tablet y desktop.

## 🎯 Objetivos del Diseño

- **Coherencia visual** en todas las pantallas
- **Experiencia de usuario optimizada** para diferentes dispositivos
- **Accesibilidad** y facilidad de uso
- **Escalabilidad** para futuras funcionalidades
- **Rendimiento** y velocidad de carga

## 🎨 Paleta de Colores

### Colores Principales
```css
--color-primary: #2E7D32        /* Verde corporativo */
--color-primary-light: #4CAF50   /* Verde claro */
--color-primary-dark: #1B5E20    /* Verde oscuro */
```

### Colores Secundarios
```css
--color-secondary: #1976D2       /* Azul profesional */
--color-secondary-light: #42A5F5 /* Azul claro */
--color-secondary-dark: #1565C0  /* Azul oscuro */
```

### Colores Neutrales
```css
--color-background: #F5F5F5      /* Fondo principal */
--color-surface: #FFFFFF          /* Superficies */
--color-text-primary: #212121     /* Texto principal */
--color-text-secondary: #757575   /* Texto secundario */
--color-text-disabled: #BDBDBD    /* Texto deshabilitado */
--color-border: #E0E0E0          /* Bordes */
--color-divider: #EEEEEE         /* Divisores */
```

### Colores de Estado
```css
--color-success: #4CAF50         /* Éxito */
--color-error: #F44336           /* Error */
--color-warning: #FF9800         /* Advertencia */
--color-info: #2196F3            /* Información */
```

## 📐 Sistema de Espaciado

Basado en múltiplos de 8px para consistencia:

```css
--spacing-xs: 4px    /* Espaciado extra pequeño */
--spacing-sm: 8px    /* Espaciado pequeño */
--spacing-md: 16px   /* Espaciado medio */
--spacing-lg: 24px   /* Espaciado grande */
--spacing-xl: 32px   /* Espaciado extra grande */
--spacing-xxl: 40px  /* Espaciado máximo */
```

## 🔤 Tipografía

### Familia de Fuentes
```css
--font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Tamaños de Fuente
```css
--font-size-xs: 12px    /* Extra pequeño */
--font-size-sm: 14px    /* Pequeño */
--font-size-md: 16px    /* Medio (base) */
--font-size-lg: 18px    /* Grande */
--font-size-xl: 24px    /* Extra grande */
--font-size-xxl: 32px   /* Máximo */
```

### Jerarquía Tipográfica
- **H1**: 32px - Títulos principales
- **H2**: 24px - Títulos de sección
- **H3**: 18px - Subtítulos
- **H4**: 16px - Títulos de tarjetas
- **Body**: 16px - Texto principal
- **Caption**: 14px - Texto secundario

## 🎭 Sombras y Elevación

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-md: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
```

## 🔄 Transiciones

```css
--transition-fast: 0.15s ease-in-out    /* Transiciones rápidas */
--transition-normal: 0.25s ease-in-out  /* Transiciones normales */
--transition-slow: 0.35s ease-in-out    /* Transiciones lentas */
```

## 📱 Breakpoints Responsive

### Móvil (< 768px)
- Layout de una columna
- Navegación con drawer
- Elementos apilados verticalmente
- Tamaños de fuente reducidos

### Tablet (768px - 1024px)
- Layout de dos columnas
- Navegación sidebar
- Elementos en grid responsive

### Desktop (> 1024px)
- Layout de múltiples columnas
- Navegación sidebar fija
- Elementos distribuidos horizontalmente

## 🧩 Componentes del Sistema

### 1. AppLayout
Layout principal que proporciona:
- Header responsive
- Sidebar/Drawer de navegación
- Área de contenido principal
- Navegación por roles

### 2. ModernCard
Tarjeta moderna con:
- Elevación y sombras
- Bordes redondeados
- Hover effects
- Padding configurable
- Headers opcionales

### 3. ModernButton
Botón consistente con:
- Múltiples variantes (contained, outlined, text)
- Estados de carga
- Iconos de inicio/fin
- Colores temáticos
- Tamaños configurables

### 4. ModernTable
Tabla responsive con:
- Headers estilizados
- Filas con hover effects
- Acciones configurables
- Estados de carga y vacío
- Tipos de celda especializados

## 📄 Páginas Implementadas

### 1. Login
- Diseño centrado con gradiente
- Formulario con validación visual
- Iconos descriptivos
- Estados de carga
- Responsive para todos los dispositivos

### 2. Depósito
- Layout con AppLayout
- Filtros y búsqueda en tarjetas
- Lista de posiciones moderna
- Formularios modales
- Estados de carga y error

### 3. Administración
- Dashboard con estadísticas
- Tabs de navegación
- Tarjetas de métricas
- Gestión de usuarios
- Actividad reciente

## 🎨 Guías de Uso

### Para Desarrolladores

1. **Usar variables CSS**: Siempre usar las variables del sistema en lugar de valores hardcodeados
2. **Componentes compartidos**: Usar los componentes ModernCard, ModernButton, etc.
3. **Responsive first**: Diseñar primero para móvil y escalar hacia arriba
4. **Consistencia**: Mantener la coherencia visual en toda la aplicación

### Para Diseñadores

1. **Paleta limitada**: Usar solo los colores definidos en el sistema
2. **Espaciado consistente**: Usar el sistema de espaciado de 8px
3. **Tipografía jerárquica**: Seguir la jerarquía de tamaños definida
4. **Estados claros**: Definir estados hover, focus, disabled para todos los elementos

## 🔧 Personalización

### Agregar Nuevos Colores
```css
:root {
  --color-nuevo: #HEXCODE;
  --color-nuevo-light: #HEXCODE;
  --color-nuevo-dark: #HEXCODE;
}
```

### Agregar Nuevos Componentes
1. Crear en `src/shared/ui/`
2. Seguir las convenciones de nomenclatura
3. Usar variables CSS del sistema
4. Documentar props y uso

## 📱 Optimizaciones Mobile

### Touch Targets
- Mínimo 44px para elementos interactivos
- Espaciado adecuado entre botones
- Feedback visual inmediato

### Gestos
- Swipe para navegación
- Tap para acciones principales
- Long press para acciones secundarias

### Performance
- Lazy loading de componentes
- Optimización de imágenes
- Código splitting por rutas

## ♿ Accesibilidad

### Contraste
- Mínimo 4.5:1 para texto normal
- Mínimo 3:1 para texto grande
- Estados de focus visibles

### Navegación
- Soporte completo para teclado
- Screen readers compatibles
- ARIA labels apropiados

### Color
- No depender solo del color para información
- Estados adicionales (iconos, texto)
- Modo oscuro futuro

## 🚀 Futuras Mejoras

1. **Modo Oscuro**: Implementar tema oscuro
2. **Animaciones**: Micro-interacciones más elaboradas
3. **Iconografía**: Sistema de iconos consistente
4. **Formularios**: Componentes de formulario avanzados
5. **Notificaciones**: Sistema de notificaciones
6. **Loading States**: Estados de carga más elaborados

---

*Este sistema de diseño está en constante evolución. Para sugerencias o mejoras, contactar al equipo de desarrollo.* 