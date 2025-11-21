import { useState } from 'react';
import { useNavegacionRapida } from '../../adicionesRapidas/hooks/useNavegacionRapida';
import { authService } from '../../../services/authService';

export const useComprasActions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { navegarAMaterialesConBusqueda } = useNavegacionRapida();

  const handleMaterialClick = (material) => {
    console.log("Material seleccionado:", material);
    
    // Verificar si el usuario puede acceder a materiales
    const currentUser = authService.getUser();
    const canAccessMateriales = currentUser && ['deposito', 'usuario', 'admin'].includes(currentUser.role);
    
    if (canAccessMateriales) {
      // Usuario puede acceder a materiales - navegar directamente
      navegarAMaterialesConBusqueda(material);
    } else {
      // Usuario no puede acceder a materiales - mostrar modal
      setSelectedMaterial(material);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleNavigateToMateriales = (material) => {
    // Solo navegar si el usuario tiene permisos
    const currentUser = authService.getUser();
    const canAccessMateriales = currentUser && ['deposito', 'usuario', 'admin'].includes(currentUser.role);
    
    if (canAccessMateriales) {
      navegarAMaterialesConBusqueda(material);
    } else {
      console.warn('Usuario no tiene permisos para acceder a materiales');
    }
  };

  return {
    handleMaterialClick,
    modalOpen,
    selectedMaterial,
    handleCloseModal,
    handleNavigateToMateriales
  };
}; 