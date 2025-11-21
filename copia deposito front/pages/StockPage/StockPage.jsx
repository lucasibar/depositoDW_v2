import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import StockMetricsPanel from '../../components/StockMetricsPanel/StockMetricsPanel';
import MobileStockView from '../../components/MobileStockView/MobileStockView';
import { useAuth } from '../../hooks/useAuth';
import {
  useStockPageData,
  useStockPageSearch,
  useStockPageModals,
  useStockPageActions,
  useNotification
} from '../../features/stock/hooks';
import {
  StockPageHeader,
  StockPagePositionsList,
  StockPagePositionDetail,
  StockPageActionsMenu,
  StockPageModals,
  StockPageNotificationSnackbar
} from '../../features/stock/ui';
import { layoutWrapperStyles, metricsPanelContainerStyles } from '../../styles/stock/stockStyles';

export const StockPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, loading, error, refreshData } = useStockPageData();
  const {
    notification,
    showNotification,
    closeNotification
  } = useNotification();
  const modals = useStockPageModals();
  const searchState = useStockPageSearch(data);
  const actions = useStockPageActions(modals, refreshData, showNotification);

  if (isLoading || !user) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <MobileStockView
          data={data}
          loading={loading}
          error={error}
          search={searchState.searchTerm}
          setSearch={searchState.onSearchChange}
          selectedIndex={searchState.selectedIndex}
          setSelectedIndex={searchState.setSelectedIndex}
          onMenuOpen={modals.openMenu}
          itemMatchesSearch={searchState.itemMatchesSearch}
          onAbrirModalAdicionRapida={modals.openAdicionRapida}
        />

        <StockPageActionsMenu
          anchorEl={modals.menuAnchor}
          onClose={modals.closeMenu}
          onAjustar={actions.handleAjustar}
          onMover={actions.handleMover}
          onGenerarRemito={actions.handleRemitoSalida}
        />

        <StockPageModals
          modals={modals}
          onMovimientoCompletado={actions.handleMovimientoCompletado}
          onAjusteExitoso={actions.handleAjusteExitoso}
          onRemitoExitoso={actions.handleRemitoSalidaExitoso}
          onAdicionSubmit={actions.handleAdicionRapidaSubmit}
        />

        <StockPageNotificationSnackbar
          notification={notification}
          onClose={closeNotification}
        />
      </>
    );
  }

  return (
    <AppLayout
      user={user}
      pageTitle="Stock"
      onLogout={() => navigate('/depositoDW_v2/')}
    >
      <StockPageHeader
        isMobile={isMobile}
        searchValue={searchState.searchTerm}
        onSearchChange={searchState.onSearchChange}
        user={user}
        currentPath={location.pathname}
      />

      <Box sx={layoutWrapperStyles(isMobile)}>
        <Box sx={metricsPanelContainerStyles}>
          <StockMetricsPanel
            data={searchState.filteredData}
            searchTerm={searchState.searchTerm}
            selectedPosition={searchState.selectedPosition?.posicion}
          />
        </Box>

        <StockPagePositionsList
          positions={searchState.filteredData}
          loading={loading}
          error={error}
          selectedIndex={searchState.selectedIndex}
          onSelectPosition={searchState.setSelectedIndex}
        />

        <StockPagePositionDetail
          position={searchState.selectedPosition}
          loading={loading}
          itemMatchesSearch={searchState.itemMatchesSearch}
          onOpenMenu={modals.openMenu}
          onOpenAdicionRapida={modals.openAdicionRapida}
        />
      </Box>

      <StockPageActionsMenu
        anchorEl={modals.menuAnchor}
        onClose={modals.closeMenu}
        onAjustar={actions.handleAjustar}
        onMover={actions.handleMover}
        onGenerarRemito={actions.handleRemitoSalida}
      />

      <StockPageModals
        modals={modals}
        onMovimientoCompletado={actions.handleMovimientoCompletado}
        onAjusteExitoso={actions.handleAjusteExitoso}
        onRemitoExitoso={actions.handleRemitoSalidaExitoso}
        onAdicionSubmit={actions.handleAdicionRapidaSubmit}
      />

      <StockPageNotificationSnackbar
        notification={notification}
        onClose={closeNotification}
      />
    </AppLayout>
  );
};

export default StockPage;
