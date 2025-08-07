import { lazy } from 'react';

// Función helper para crear lazy imports seguros
const createLazyImport = (importFn, fallbackComponent) => {
  return lazy(() => 
    importFn().catch(error => {
      console.error('Error cargando componente:', error);
      // Retornar un componente de fallback
      return Promise.resolve({
        default: fallbackComponent || (() => <div>Error cargando componente</div>)
      });
    })
  );
};

// Lazy imports con manejo de errores
export const DepositoPage = createLazyImport(
  () => import('../pages/DepositoPage/DepositoPage').then(module => ({ default: module.DepositoPage })),
  () => <div>Cargando Depósito...</div>
);

export const ComprasPage = createLazyImport(
  () => import('../pages/ComprasPage/ComprasPage').then(module => ({ default: module.ComprasPage })),
  () => <div>Cargando Compras...</div>
);

export const AdminPage = createLazyImport(
  () => import('../pages/AdminPage/AdminPage').then(module => ({ default: module.AdminPage })),
  () => <div>Cargando Admin...</div>
);

export const CalidadPage = createLazyImport(
  () => import('../pages/CalidadPage/CalidadPage').then(module => ({ default: module.CalidadPage })),
  () => <div>Cargando Calidad...</div>
);

export const SalidaPage = createLazyImport(
  () => import('../pages/SalidaPage/SalidaPage').then(module => ({ default: module.SalidaPage })),
  () => <div>Cargando Salida...</div>
); 