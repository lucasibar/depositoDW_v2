import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemitosData, createRemitoEntrada } from '../../../features/remitos/model/slice';
import styles from './CreateRemitoForm.module.css';

export const CreateRemitoForm = ({ onRemitoCreated }) => {
  const dispatch = useDispatch();
  const { items, proveedores, isLoading, error } = useSelector(state => state.remitos);
  
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [remitoItems, setRemitoItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Estados para búsqueda
  const [proveedorSearch, setProveedorSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [showProveedorDropdown, setShowProveedorDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  
  const proveedorInputRef = useRef(null);
  const itemInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRemitosData());
  }, [dispatch]);

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (proveedorInputRef.current && !proveedorInputRef.current.contains(event.target)) {
        setShowProveedorDropdown(false);
      }
      if (itemInputRef.current && !itemInputRef.current.contains(event.target)) {
        setShowItemDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedProveedor && items.length > 0) {
      const itemsDelProveedor = items.filter(item => 
        item.proveedor && item.proveedor.id === selectedProveedor
      );
      setFilteredItems(itemsDelProveedor);
    } else {
      setFilteredItems([]);
    }
    setSelectedItem('');
    setItemSearch('');
  }, [selectedProveedor, items]);

  // Filtrar proveedores basado en búsqueda
  const filteredProveedores = proveedores
    .filter(prov => prov.categoria === 'proveedor')
    .filter(prov => 
      prov.nombre.toLowerCase().includes(proveedorSearch.toLowerCase())
    );

  // Filtrar items basado en búsqueda
  const filteredItemsBySearch = filteredItems.filter(item =>
    item.descripcion.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.categoria.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const handleAddItem = () => {
    if (!selectedItem || cantidad <= 0) return;

    const item = filteredItems.find(item => item.id === selectedItem);
    if (!item) return;

    const newItem = {
      id: item.id,
      descripcion: item.descripcion,
      categoria: item.categoria,
      cantidad: parseInt(cantidad),
      proveedor: item.proveedor
    };

    setRemitoItems([...remitoItems, newItem]);
    setSelectedItem('');
    setItemSearch('');
    setCantidad(1);
  };

  const handleProveedorSelect = (proveedor) => {
    setSelectedProveedor(proveedor.id);
    setProveedorSearch(proveedor.nombre);
    setShowProveedorDropdown(false);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item.id);
    setItemSearch(`${item.descripcion} - ${item.categoria}`);
    setShowItemDropdown(false);
  };

  const handleProveedorInputChange = (e) => {
    setProveedorSearch(e.target.value);
    setSelectedProveedor('');
    setShowProveedorDropdown(true);
  };

  const handleItemInputChange = (e) => {
    setItemSearch(e.target.value);
    setSelectedItem('');
    setShowItemDropdown(true);
  };

  const handleRemoveItem = (index) => {
    const newItems = remitoItems.filter((_, i) => i !== index);
    setRemitoItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remitoItems.length === 0) {
      alert('Debe agregar al menos un item al remito');
      return;
    }

    const remitoData = {
      proveedorId: selectedProveedor,
      items: remitoItems,
      fecha: new Date().toISOString(),
      tipo: 'entrada'
    };

    try {
      await dispatch(createRemitoEntrada(remitoData)).unwrap();
      
      // Limpiar el formulario
      setSelectedProveedor('');
      setSelectedItem('');
      setProveedorSearch('');
      setItemSearch('');
      setCantidad(1);
      setRemitoItems([]);
      setFilteredItems([]);
      
      if (onRemitoCreated) {
        onRemitoCreated(remitoData);
      }
      
      alert('Remito creado exitosamente');
    } catch (error) {
      alert(`Error al crear el remito: ${error}`);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando datos...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3>Crear Nuevo Remito</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Búsqueda de Proveedor */}
        <div className={styles.formGroup}>
          <label htmlFor="proveedor">Proveedor:</label>
          <div className={styles.searchContainer}>
            <input
              type="text"
              id="proveedor"
              value={proveedorSearch}
              onChange={handleProveedorInputChange}
              onFocus={() => setShowProveedorDropdown(true)}
              placeholder="Buscar proveedor..."
              className={styles.searchInput}
              ref={proveedorInputRef}
              required
            />
            {showProveedorDropdown && filteredProveedores.length > 0 && (
              <div className={styles.dropdown}>
                {filteredProveedores.map(proveedor => (
                  <div
                    key={proveedor.id}
                    className={styles.dropdownItem}
                    onClick={() => handleProveedorSelect(proveedor)}
                  >
                    {proveedor.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Búsqueda de Item (solo si hay proveedor seleccionado) */}
        {selectedProveedor && (
          <div className={styles.formGroup}>
            <label htmlFor="item">Item:</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                id="item"
                value={itemSearch}
                onChange={handleItemInputChange}
                onFocus={() => setShowItemDropdown(true)}
                placeholder="Buscar item..."
                className={styles.searchInput}
                ref={itemInputRef}
              />
              {showItemDropdown && filteredItemsBySearch.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredItemsBySearch.map(item => (
                    <div
                      key={item.id}
                      className={styles.dropdownItem}
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className={styles.itemName}>{item.descripcion}</div>
                      <div className={styles.itemCategory}>{item.categoria}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cantidad */}
        {selectedItem && (
          <div className={styles.formGroup}>
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              className={styles.input}
            />
          </div>
        )}

        {/* Botón para agregar item */}
        {selectedItem && cantidad > 0 && (
          <button
            type="button"
            onClick={handleAddItem}
            className={styles.addButton}
          >
            Agregar Item
          </button>
        )}

        {/* Lista de items agregados */}
        {remitoItems.length > 0 && (
          <div className={styles.itemsList}>
            <h4>Items del Remito:</h4>
            {remitoItems.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <span className={styles.itemDesc}>
                  {item.descripcion} - {item.categoria}
                </span>
                <span className={styles.itemCant}>
                  Cantidad: {item.cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón para crear remito */}
        {remitoItems.length > 0 && (
          <button type="submit" className={styles.submitButton}>
            Crear Remito
          </button>
        )}
      </form>
    </div>
  );
}; 