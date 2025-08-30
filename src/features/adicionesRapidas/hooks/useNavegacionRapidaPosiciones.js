import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNavegacionRapidaPosiciones, limpiarNavegacionRapidaPosiciones } from '../model/slice';
import { selectNavegacionRapidaPosiciones } from '../model/selectors';
import { authService } from '../../../services/authService';

export const useNavegacionRapidaPosiciones = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navegacionRapidaPosiciones = useSelector(selectNavegacionRapidaPosiciones);

  const navegarAPosicionesConBusqueda = (resultado) => {
    if (!resultado || !resultado.posicion) {
      console.warn('Resultado no válido para navegación rápida a posiciones:', resultado);
      return;
    }

    // Verificar el rol del usuario actual
    const currentUser = authService.getUser();
    if (!currentUser || !currentUser.role) {
      console.warn('Usuario no autenticado o sin rol definido');
      return;
    }

    // Extraer información de la posición
    const posicion = resultado.posicion;
    let posicionData = {};

    if (posicion.rack && posicion.fila && posicion.AB) {
      // Posición con rack, fila y nivel
      posicionData = {
        rack: posicion.rack,
        fila: posicion.fila,
        nivel: posicion.AB
      };
    } else if (posicion.numeroPasillo) {
      // Posición con pasillo
      posicionData = {
        pasillo: posicion.numeroPasillo
      };
    } else if (posicion.entrada === true) {
      // Posición de entrada
      posicionData = {
        entrada: true
      };
    } else {
      console.warn('Posición no válida para navegación rápida:', posicion);
      return;
    }

    // Configurar el estado de navegación rápida a posiciones
    dispatch(setNavegacionRapidaPosiciones({
      posicionSeleccionada: posicionData,
      ejecutarBusqueda: true
    }));

    // Determinar la ruta de destino según el rol del usuario
    let rutaDestino = '/depositoDW_v2/';
    
    if (['deposito', 'admin'].includes(currentUser.role)) {
      // Usuario puede acceder a posiciones
      rutaDestino = '/depositoDW_v2/posiciones';
    } else {
      // Otros roles - redirigir a su página principal
      rutaDestino = `/depositoDW_v2/${currentUser.role}`;
      console.log(`Usuario con rol ${currentUser.role} - redirigiendo a ${rutaDestino}`);
    }

    console.log('Navegando a posiciones:', rutaDestino, 'con posición:', posicionData);
    navigate(rutaDestino);
  };

  const limpiarEstadoNavegacion = () => {
    dispatch(limpiarNavegacionRapidaPosiciones());
  };

  return {
    navegacionRapidaPosiciones,
    navegarAPosicionesConBusqueda,
    limpiarEstadoNavegacion
  };
};
