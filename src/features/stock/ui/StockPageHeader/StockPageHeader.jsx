import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Search as SearchIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import {
  headerContainerStyles,
  headerContentStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  searchWrapperStyles,
  searchIconStyles,
  searchInputStyles
} from '../../../../styles/stock/stockStyles';
import { useStockPageReport } from '../../hooks/useStockPageReport';

const StockPageHeader = ({
  isMobile,
  searchValue,
  onSearchChange,
  user,
  currentPath,
  showNotification
}) => {
  const { loadingReporte, exportStockReport } = useStockPageReport(showNotification);

  return (
    <Box sx={headerContainerStyles(isMobile)}>
      <Box sx={headerContentStyles}>
        <Box sx={headerTitleWrapperStyles}>
          <Box sx={searchWrapperStyles}>
            <SearchIcon sx={searchIconStyles} />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar..."
              style={searchInputStyles}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportStockReport}
            disabled={loadingReporte}
            sx={{ ml: 2 }}
          >
            {loadingReporte ? 'Exportando...' : 'Informes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StockPageHeader;

