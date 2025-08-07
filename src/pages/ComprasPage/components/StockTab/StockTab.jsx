import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useStockData } from "../../../../features/stock/hooks";
import { useComprasActions } from "../../../../features/compras/hooks";
import { LoadingState, ErrorState, StockContent } from "../../../../features/stock/ui";
import ModernCard from "../../../../shared/ui/ModernCard/ModernCard";

export const StockTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    filteredMaterials,
    isLoading,
    error,
    handleSearch,
    handleRetry
  } = useStockData();

  const { handleMaterialClick } = useComprasActions();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ModernCard
        title="Error al cargar el stock"
        subtitle="No se pudieron cargar los datos del inventario"
        sx={{ maxWidth: 600, mx: 'auto' }}
      >
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          startIcon={<RefreshIcon />}
          sx={{ backgroundColor: 'var(--color-primary)' }}
        >
          Reintentar
        </Button>
      </ModernCard>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <StockContent
        filteredMaterials={filteredMaterials}
        onSearch={handleSearch}
        onMaterialClick={handleMaterialClick}
      />
    </Box>
  );
};
