import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNavegacionRapidaStock, limpiarNavegacionRapidaStock } from '../model/slice';
import { selectNavegacionRapidaStock } from '../model/selectors';
import { authService } from '../../../services/authService';

export const useNavegacionRapidaStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navegacionRapidaStock = useSelector(selectNavegacionRapidaStock);

  const navegarAStockConBusqueda = (resultado) => {
    if (!resultado || !resultado.item) {
      console.warn('Resultado no válido para navegación rápida a stock:', resultado);
      return;
    }

    // Verificar el rol del usuario actual
    const currentUser = authService.getUser();
    if (!currentUser || !currentUser.role) {
      console.warn('Usuario no autenticado o sin rol definido');
      return;
    }

    // Extraer información del item
    const item = resultado.item;
    const proveedor = resultado.proveedor;

    // Configurar el estado de navegación rápida a stock
    dispatch(setNavegacionRapidaStock({
      itemSeleccionado: {
        id: item.id,
        categoria: item.categoria,
        descripcion: item.descripcion
      },
      proveedorSeleccionado: proveedor?.nombre || null,
      ejecutarBusqueda: true
    }));

    // Determinar la ruta de destino según el rol del usuario
    let rutaDestino = '/depositoDW_v2/';
    
    if (['deposito', 'usuario', 'admin'].includes(currentUser.role)) {
      // Usuario puede acceder a stock
      rutaDestino = '/depositoDW_v2/stock';
    } else {
      // Otros roles - redirigir a su página principal
      rutaDestino = `/depositoDW_v2/${currentUser.role}`;
      console.log(`Usuario con rol ${currentUser.role} - redirigiendo a ${rutaDestino}`);
    }

    console.log('Navegando a stock:', rutaDestino, 'con item:', item);
    navigate(rutaDestino);
  };

  const limpiarEstadoNavegacion = () => {
    dispatch(limpiarNavegacionRapidaStock());
  };

  return {
    navegacionRapidaStock,
    navegarAStockConBusqueda,
    limpiarEstadoNavegacion
  };
};
