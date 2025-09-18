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
  const [reciclado, setReciclado] = useState(false);
  const [certificadoTransaccion, setCertificadoTransaccion] = useState('');
  const [prePos, setPrePos] = useState('');
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

    // Validar campos de reciclado si está marcado
    if (reciclado && (!certificadoTransaccion || !prePos)) {
      alert('Si la mercadería es reciclada, debe completar el certificado de transacción y seleccionar PRE o POS consumo');
      return;
    }

    const itemSeleccionado = items.find(item => item.id === selectedItem);
    const nuevaPartida = {
      kilos: parseFloat(kilos),
      numeroPartida: numeroPartida,
      unidades: parseInt(unidades),
      item: itemSeleccionado,
      reciclado: reciclado,
      certificado_transaccion: reciclado ? certificadoTransaccion : null,
      pre_pos: reciclado ? prePos : null
    };

    setPartidasRemito([...partidasRemito, nuevaPartida]);
    
    // Limpiar campos
    setSelectedItem('');
    setItemSearch('');
    setNumeroPartida('');
    setKilos('');
    setUnidades('');
    setReciclado(false);
    setCertificadoTransaccion('');
    setPrePos('');
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
          <div className={styles.section}>
            <h4>Agregar Partidas</h4>
            
            {!selectedProveedor && (
              <div className={styles.warningMessage}>
                <p>⚠️ Debe seleccionar un proveedor antes de agregar partidas</p>
              </div>
            )}
            
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
                    placeholder={selectedProveedor ? "Buscar item por descripción o categoría..." : "Seleccione un proveedor primero"}
                    className={`${styles.searchInput} ${!selectedProveedor ? styles.disabledInput : ''}`}
                    autoComplete="off"
                    disabled={!selectedProveedor}
                  />
                  <button
                    type="button"
                    onClick={() => setShowItemModal(true)}
                    className={`${styles.addItemButton} ${!selectedProveedor ? styles.disabledButton : ''}`}
                    title="Agregar nuevo item"
                    disabled={!selectedProveedor}
                  >
                    +
                  </button>
                </div>
                {showItemDropdown && filteredItems.length > 0 && selectedProveedor && (
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
                  className={`${styles.input} ${!selectedProveedor ? styles.disabledInput : ''}`}
                  placeholder="Puede contener letras"
                  disabled={!selectedProveedor}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="kilos">Kilos:</label>
                <input
                  type="number"
                  id="kilos"
                  value={kilos}
                  onChange={(e) => setKilos(e.target.value)}
                  className={`${styles.input} ${!selectedProveedor ? styles.disabledInput : ''}`}
                  step="0.01"
                  min="0"
                  disabled={!selectedProveedor}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="unidades">Unidades:</label>
                <input
                  type="number"
                  id="unidades"
                  value={unidades}
                  onChange={(e) => setUnidades(e.target.value)}
                  className={`${styles.input} ${!selectedProveedor ? styles.disabledInput : ''}`}
                  min="0"
                  disabled={!selectedProveedor}
                />
              </div>
            </div>

            {/* Campos de Reciclado */}
            <div className={styles.recicladoSection}>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={reciclado}
                    onChange={(e) => {
                      setReciclado(e.target.checked);
                      if (!e.target.checked) {
                        setCertificadoTransaccion('');
                        setPrePos('');
                      }
                    }}
                    disabled={!selectedProveedor}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Mercadería Reciclada</span>
                </label>
              </div>

              {reciclado && (
                <div className={styles.recicladoFields}>
                  <div className={styles.formGroup}>
                    <label htmlFor="certificadoTransaccion">Certificado de Transacción:</label>
                    <input
                      type="text"
                      id="certificadoTransaccion"
                      value={certificadoTransaccion}
                      onChange={(e) => setCertificadoTransaccion(e.target.value)}
                      className={`${styles.input} ${!selectedProveedor ? styles.disabledInput : ''}`}
                      placeholder="Número o código del certificado"
                      disabled={!selectedProveedor}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tipo de Consumo:</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="prePos"
                          value="PRE"
                          checked={prePos === 'PRE'}
                          onChange={(e) => setPrePos(e.target.value)}
                          disabled={!selectedProveedor}
                          className={styles.radio}
                        />
                        <span className={styles.radioText}>PRE Consumo</span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="prePos"
                          value="POS"
                          checked={prePos === 'POS'}
                          onChange={(e) => setPrePos(e.target.value)}
                          disabled={!selectedProveedor}
                          className={styles.radio}
                        />
                        <span className={styles.radioText}>POS Consumo</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddPartida}
              className={`${styles.addButton} ${!selectedProveedor ? styles.disabledButton : ''}`}
              disabled={!selectedProveedor || !selectedItem || !numeroPartida || !kilos || !unidades}
            >
              Agregar Partida
            </button>
          </div>

          {/* LISTA DE PARTIDAS */}
          <div className={styles.section}>
            <h4>Partidas del Remito ({partidasRemito.length})</h4>
            
            {partidasRemito.length === 0 ? (
              <div className={styles.emptyState}>
                <p>📋 No hay partidas agregadas al remito</p>
                <p>Complete los campos de arriba y haga clic en "Agregar Partida" para comenzar</p>
              </div>
            ) : (
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
                        {partida.reciclado === true && (
                          <>
                            <span className={styles.recicladoTag}>🔄 Reciclado</span>
                            {partida.certificado_transaccion && (
                              <span>Cert: {partida.certificado_transaccion}</span>
                            )}
                            {partida.pre_pos && (
                              <span>{partida.pre_pos} Consumo</span>
                            )}
                          </>
                        )}
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
            )}
          </div>

          {/* BOTÓN PARA CREAR REMITO */}
          <div className={styles.submitSection}>
            <button 
              type="submit" 
              className={`${styles.submitButton} ${partidasRemito.length === 0 ? styles.disabledButton : ''}`}
              disabled={partidasRemito.length === 0}
            >
              Crear Remito de Entrada
            </button>
            {partidasRemito.length === 0 && (
              <p className={styles.submitHint}>
                Agregue al menos una partida para poder crear el remito
              </p>
            )}
          </div>
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