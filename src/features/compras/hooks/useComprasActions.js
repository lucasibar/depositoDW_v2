export const useComprasActions = () => {
  const handleMaterialClick = (material) => {
    console.log("Material seleccionado:", material);
    // Aquí puedes agregar lógica específica para compras
    // Por ejemplo, abrir un modal con detalles o navegar a otra página
  };

  return {
    handleMaterialClick
  };
}; 