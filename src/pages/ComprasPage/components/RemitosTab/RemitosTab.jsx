import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Alert } from "@mui/material";
import { selectRemitosLoading, selectRemitosError } from "../../../../features/remitos/model/selectors";
import { CreateRemitoEntradaForm } from "../../../../widgets/remitos/CreateRemitoEntradaForm/CreateRemitoEntradaForm";
import { RemitosHeader } from "./components/RemitosHeader/RemitosHeader";
import { RemitosList } from "./components/RemitosList/RemitosList";
import styles from "./RemitosTab.module.css";

export const RemitosTab = () => {
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);
  const [showForm, setShowForm] = useState(false);

  const handleCreateRemito = () => {
    setShowForm(!showForm);
  };

  const handleRemitoCreated = (remitoData) => {
    console.log('Remito creado:', remitoData);
    setShowForm(false);
  };

  return (
    <div className={styles.remitosTab}>
      <RemitosHeader 
        showForm={showForm} 
        onToggleForm={handleCreateRemito} 
      />

      {showForm && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fafafa' }}>
          <CreateRemitoEntradaForm onRemitoCreated={handleRemitoCreated} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Remitos
        </Typography>
        <RemitosList />
      </Box>
    </div>
  );
};
