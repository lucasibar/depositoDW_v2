import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNavegacionRapida, limpiarNavegacionRapida } from '../model/slice';
import { selectNavegacionRapida } from '../model/selectors';
import { authService } from '../../../services/authService';

export const useNavegacionRapida = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navegacionRapida = useSelector(selectNavegacionRapida);

  const navegarAMaterialesConBusqueda = (material) => {
    if (!material || !material.item) {
      console.warn('Material no válido para navegación rápida:', material);
      return;
    }

    // Verificar el rol del usuario actual
    const currentUser = authService.getUser();
    if (!currentUser || !currentUser.role) {
      console.warn('Usuario no autenticado o sin rol definido');
      return;
    }

    // Extraer información del material
    const item = material.item;
    const proveedor = material.proveedor || material.partida?.proveedor;

    // Configurar el estado de navegación rápida
    dispatch(setNavegacionRapida({
      itemSeleccionado: {
        id: item.id,
        categoria: item.categoria,
        descripcion: item.descripcion
      },
      proveedorSeleccionado: proveedor,
      ejecutarBusqueda: true
    }));

    // Determinar la ruta de destino según el rol del usuario
    let rutaDestino = '/depositoDW_v2/';
    
    if (['deposito', 'usuario', 'admin'].includes(currentUser.role)) {
      // Usuario puede acceder a materiales
      rutaDestino = '/depositoDW_v2/materiales';
    } else if (['compras'].includes(currentUser.role)) {
      // Usuario de compras - redirigir a compras con información del material
      rutaDestino = '/depositoDW_v2/compras';
      console.log('Usuario de compras - redirigiendo a compras con material:', item);
    } else {
      // Otros roles - redirigir a su página principal
      rutaDestino = `/depositoDW_v2/${currentUser.role}`;
      console.log(`Usuario con rol ${currentUser.role} - redirigiendo a ${rutaDestino}`);
    }

    console.log('Navegando a:', rutaDestino, 'con material:', item);
    navigate(rutaDestino);
  };

  const limpiarEstadoNavegacion = () => {
    dispatch(limpiarNavegacionRapida());
  };

  return {
    navegacionRapida,
    navegarAMaterialesConBusqueda,
    limpiarEstadoNavegacion
  };
};
