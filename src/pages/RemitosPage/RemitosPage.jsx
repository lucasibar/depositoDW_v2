import React, { useState } from 'react';
import { CreateRemitoForm } from '../../widgets/remitos/CreateRemitoForm/CreateRemitoForm';
import styles from './RemitosPage.module.css';

export const RemitosPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleRemitoCreated = (remitoData) => {
    console.log('Remito creado:', remitoData);
    // Aquí puedes agregar lógica adicional después de crear el remito
    // Por ejemplo, actualizar una lista de remitos, mostrar notificación, etc.
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Remitos</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.toggleButton}
        >
          {showForm ? 'Ocultar Formulario' : 'Crear Nuevo Remito'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <CreateRemitoForm onRemitoCreated={handleRemitoCreated} />
        </div>
      )}

      <div className={styles.content}>
        <h2>Lista de Remitos</h2>
        <p>Aquí se mostrará la lista de remitos existentes...</p>
        {/* Aquí puedes agregar un componente para mostrar la lista de remitos */}
      </div>
    </div>
  );
}; 