import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemitosData, createRemitoEntrada } from '../../../features/remitos/model/slice';
import { selectProveedores, selectItems, selectRemitosLoading, selectRemitosError } from '../../../features/remitos/model/selectors';
import styles from './CreateRemitoEntradaForm.module.css';

export const CreateRemitoEntradaForm = ({ onRemitoCreated }) => {
  const dispatch = useDispatch();
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);
  
  // Estados para la primera parte del formulario
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [numeroRemito, setNumeroRemito] = useState('');
  const [fechaRemito, setFechaRemito] = useState('');
  
  // Estados para la segunda parte del formulario
  const [selectedItem, setSelectedItem] = useState(null);
  const [numeroPartida, setNumeroPartida] = useState('');
  const [kilos, setKilos] = useState('');
  const [unidades, setUnidades] = useState('');
  
  // Lista de partidas del remito
  const [partidasRemito, setPartidasRemito] = useState([]);
  
  // Estados para búsqueda
  const [proveedorSearch, setProveedorSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [showProveedorDropdown, setShowProveedorDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  
  const proveedorInputRef = useRef(null);
  const itemInputRef = useRef(null);

  useEffect(() => {
    // Solo cargar datos si no están ya cargados
    if (proveedores.length === 0 && items.length === 0) {
      dispatch(fetchRemitosData());
    }
  }, [dispatch, proveedores.length, items.length]);

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

  // Filtrar proveedores basado en búsqueda
  const filteredProveedores = proveedores
    .filter(prov => prov.categoria === 'proveedor')
    .filter(prov => 
      prov.nombre.toLowerCase().includes(proveedorSearch.toLowerCase())
    );

  // Filtrar items del proveedor seleccionado
  const filteredItems = selectedProveedor 
    ? items.filter(item => 
        item.proveedor && item.proveedor.id === selectedProveedor.id
      ).filter(item =>
        item.descripcion.toLowerCase().includes(itemSearch.toLowerCase()) ||
        item.categoria.toLowerCase().includes(itemSearch.toLowerCase())
      )
    : [];

  const handleProveedorSelect = (proveedor) => {
    setSelectedProveedor(proveedor);
    setProveedorSearch(proveedor.nombre);
    setShowProveedorDropdown(false);
    // Limpiar item seleccionado cuando cambia el proveedor
    setSelectedItem(null);
    setItemSearch('');
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setItemSearch(`${item.descripcion} - ${item.categoria}`);
    setShowItemDropdown(false);
  };

  const handleProveedorInputChange = (e) => {
    setProveedorSearch(e.target.value);
    setSelectedProveedor(null);
    setShowProveedorDropdown(true);
  };

  const handleItemInputChange = (e) => {
    setItemSearch(e.target.value);
    setSelectedItem(null);
    setShowItemDropdown(true);
  };

  const handleAddPartida = () => {
    if (!selectedItem || !numeroPartida || !kilos || !unidades) {
      alert('Por favor complete todos los campos de la partida');
      return;
    }

    const nuevaPartida = {
      kilos: parseFloat(kilos),
      numeroPartida: numeroPartida,
      unidades: parseInt(unidades),
      item: selectedItem
    };

    setPartidasRemito([...partidasRemito, nuevaPartida]);
    
    // Limpiar campos de partida
    setSelectedItem(null);
    setItemSearch('');
    setNumeroPartida('');
    setKilos('');
    setUnidades('');
  };

  const handleRemovePartida = (index) => {
    const nuevasPartidas = partidasRemito.filter((_, i) => i !== index);
    setPartidasRemito(nuevasPartidas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProveedor || !numeroRemito || !fechaRemito) {
      alert('Por favor complete todos los campos del remito');
      return;
    }

    if (partidasRemito.length === 0) {
      alert('Debe agregar al menos una partida al remito');
      return;
    }

    const remitoData = {
      fechaSeleccionado: fechaRemito,
      numeroRemitoSeleccionado: numeroRemito,
      partidasRemito: partidasRemito,
      proveedorSeleccionado: selectedProveedor,
      tipoMovimiento: 'entrada'
    };

    try {
      await dispatch(createRemitoEntrada(remitoData)).unwrap();
      
      // Limpiar el formulario
      setSelectedProveedor(null);
      setProveedorSearch('');
      setNumeroRemito('');
      setFechaRemito('');
      setPartidasRemito([]);
      
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
      <h3>Crear Remito de Entrada</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* PRIMERA PARTE - DATOS DEL REMITO */}
        <div className={styles.section}>
          <h4>Datos del Remito</h4>
          
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

          <div className={styles.formGroup}>
            <label htmlFor="numeroRemito">Número de Remito:</label>
            <input
              type="text"
              id="numeroRemito"
              value={numeroRemito}
              onChange={(e) => setNumeroRemito(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fechaRemito">Fecha del Remito:</label>
            <input
              type="date"
              id="fechaRemito"
              value={fechaRemito}
              onChange={(e) => setFechaRemito(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        </div>

        {/* SEGUNDA PARTE - AGREGAR PARTIDAS */}
        {selectedProveedor && (
          <div className={styles.section}>
            <h4>Agregar Partidas</h4>
            
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
                {showItemDropdown && filteredItems.length > 0 && (
                  <div className={styles.dropdown}>
                    {filteredItems.map(item => (
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

            <div className={styles.partidaFields}>
              <div className={styles.formGroup}>
                <label htmlFor="numeroPartida">Número de Partida:</label>
                <input
                  type="text"
                  id="numeroPartida"
                  value={numeroPartida}
                  onChange={(e) => setNumeroPartida(e.target.value)}
                  className={styles.input}
                  placeholder="Puede contener letras"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="kilos">Kilos:</label>
                <input
                  type="number"
                  id="kilos"
                  value={kilos}
                  onChange={(e) => setKilos(e.target.value)}
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="unidades">Unidades:</label>
                <input
                  type="number"
                  id="unidades"
                  value={unidades}
                  onChange={(e) => setUnidades(e.target.value)}
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPartida}
              className={styles.addButton}
              disabled={!selectedItem || !numeroPartida || !kilos || !unidades}
            >
              Agregar Partida
            </button>
          </div>
        )}

        {/* LISTA DE PARTIDAS */}
        {partidasRemito.length > 0 && (
          <div className={styles.section}>
            <h4>Partidas del Remito ({partidasRemito.length})</h4>
            <div className={styles.partidasList}>
              {partidasRemito.map((partida, index) => (
                <div key={index} className={styles.partidaItem}>
                  <div className={styles.partidaInfo}>
                    <div className={styles.partidaHeader}>
                      <strong>{partida.item.descripcion}</strong>
                      <span className={styles.partidaCategory}>{partida.item.categoria}</span>
                    </div>
                    <div className={styles.partidaDetails}>
                      <span>Partida: {partida.numeroPartida}</span>
                      <span>Kilos: {partida.kilos}</span>
                      <span>Unidades: {partida.unidades}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePartida(index)}
                    className={styles.removeButton}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTÓN PARA CREAR REMITO */}
        {partidasRemito.length > 0 && (
          <button type="submit" className={styles.submitButton}>
            Crear Remito de Entrada
          </button>
        )}
      </form>
    </div>
  );
}; 