import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemitosData, createRemitoEntrada } from '../../../features/remitos/model/slice';
import { selectProveedores, selectItems, selectRemitosLoading, selectRemitosError } from '../../../features/remitos/model/selectors';
import { ModalAgregarProveedor } from '../ModalAgregarProveedor/ModalAgregarProveedor';
import { ModalAgregarItem } from '../ModalAgregarItem/ModalAgregarItem';
import styles from './CreateRemitoEntradaForm.module.css';

export const CreateRemitoEntradaForm = ({ onRemitoCreated }) => {
  const dispatch = useDispatch();
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);
  
  // Estados para el formulario
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [numeroRemito, setNumeroRemito] = useState('');
  const [fechaRemito, setFechaRemito] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [numeroPartida, setNumeroPartida] = useState('');
  const [kilos, setKilos] = useState('');
  const [unidades, setUnidades] = useState('');
  const [partidasRemito, setPartidasRemito] = useState([]);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  const itemInputRef = useRef(null);

  // Cargar datos al montar
  useEffect(() => {
    dispatch(fetchRemitosData());
  }, [dispatch]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemInputRef.current && !itemInputRef.current.contains(event.target)) {
        setShowItemDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar proveedores (solo categoría 'proveedor')
  const filteredProveedores = proveedores.filter(prov => prov.categoria === 'proveedor');

  // Filtrar items por proveedor seleccionado y búsqueda
  const filteredItems = selectedProveedor 
    ? items.filter(item => {
        // Solo items (no proveedores) - items tienen 'descripcion', proveedores tienen 'nombre'
        const isItem = item.descripcion && !item.nombre;
        
        if (!isItem) return false;

        // Filtrar por proveedor
        let matchesProveedor = false;
        if (item.proveedor) {
          // Si item.proveedor es un objeto con id
          if (item.proveedor.id) {
            matchesProveedor = item.proveedor.id === selectedProveedor;
          }
          // Si item.proveedor es un objeto con nombre
          else if (item.proveedor.nombre) {
            const selectedProveedorObj = proveedores.find(p => p.id === selectedProveedor);
            matchesProveedor = item.proveedor.nombre === selectedProveedorObj?.nombre;
          }
        }

        // Filtrar por búsqueda - cada palabra debe estar en descripción o categoría
        const matchesSearch = itemSearch === '' || (() => {
          const searchWords = itemSearch.toLowerCase().trim().split(' ').filter(word => word.length > 0);
          if (searchWords.length === 0) return true;
          
          const itemText = `${item.descripcion} ${item.categoria}`.toLowerCase();
          
          // Todas las palabras deben estar en el texto del item
          return searchWords.every(word => itemText.includes(word));
        })();

        return matchesProveedor && matchesSearch;
      })
    : [];

  const handleItemSelect = (item) => {
    setSelectedItem(item.id);
    setItemSearch(`${item.descripcion} - ${item.categoria}`);
    setShowItemDropdown(false);
  };

  const handleItemSearchChange = (e) => {
    setItemSearch(e.target.value);
    setSelectedItem('');
    setShowItemDropdown(true);
  };

  const handleProveedorCreado = (nuevoProveedor) => {
    setSelectedProveedor(nuevoProveedor.id);
  };

  const handleItemCreado = (nuevoItem) => {
    setSelectedItem(nuevoItem.id);
    setItemSearch(`${nuevoItem.descripcion} - ${nuevoItem.categoria}`);
  };

  const handleAddPartida = () => {
    if (!selectedItem || !numeroPartida || !kilos || !unidades) {
      alert('Por favor complete todos los campos de la partida');
      return;
    }

    const itemSeleccionado = items.find(item => item.id === selectedItem);
    const nuevaPartida = {
      kilos: parseFloat(kilos),
      numeroPartida: numeroPartida,
      unidades: parseInt(unidades),
      item: itemSeleccionado
    };

    setPartidasRemito([...partidasRemito, nuevaPartida]);
    
    // Limpiar campos
    setSelectedItem('');
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

    const proveedorSeleccionado = proveedores.find(prov => prov.id === selectedProveedor);

    const remitoData = {
      fechaSeleccionado: fechaRemito,
      numeroRemitoSeleccionado: numeroRemito,
      partidasRemito: partidasRemito,
      proveedorSeleccionado: proveedorSeleccionado,
      tipoMovimiento: 'remitoEntrada'
    };

    try {
      await dispatch(createRemitoEntrada(remitoData)).unwrap();
      
      // Limpiar formulario
      setSelectedProveedor('');
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

  return (
    <>
      <div className={styles.container}>
        <h3>Crear Remito de Entrada</h3>
        
        {isLoading && (
          <div className={styles.loading}>Cargando datos...</div>
        )}

        {error && (
          <div className={styles.error}>Error: {error}</div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* DATOS DEL REMITO */}
          <div className={styles.section}>
            <h4>Datos del Remito</h4>
            
            <div className={styles.formGroup}>
              <label htmlFor="proveedor">Proveedor:</label>
              <select
                id="proveedor"
                value={selectedProveedor}
                onChange={(e) => {
                  if (e.target.value === 'nuevo') {
                    setShowProveedorModal(true);
                  } else {
                    setSelectedProveedor(e.target.value);
                  }
                }}
                className={styles.select}
                required
              >
                <option value="">Seleccionar proveedor</option>
                <option value="nuevo" style={{ fontStyle: 'italic', color: '#666' }}>
                  + Agregar nuevo proveedor
                </option>
                {filteredProveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
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

          {/* AGREGAR PARTIDAS */}
          {selectedProveedor && (
            <div className={styles.section}>
              <h4>Agregar Partidas</h4>
              
                          <div className={styles.formGroup}>
              <label htmlFor="item">Item:</label>
              <div className={styles.searchContainer} ref={itemInputRef}>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    id="item"
                    value={itemSearch}
                    onChange={handleItemSearchChange}
                    onFocus={() => setShowItemDropdown(true)}
                    placeholder="Buscar item por descripción o categoría..."
                    className={styles.searchInput}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowItemModal(true)}
                    className={styles.addItemButton}
                    title="Agregar nuevo item"
                  >
                    +
                  </button>
                </div>
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

      <ModalAgregarProveedor 
        open={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        onProveedorCreado={handleProveedorCreado}
      />

      <ModalAgregarItem 
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        onItemCreado={handleItemCreado}
        proveedorSeleccionado={proveedores.find(prov => prov.id === selectedProveedor)}
      />
    </>
  );
}; 