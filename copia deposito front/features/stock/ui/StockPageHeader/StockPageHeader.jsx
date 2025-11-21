import React from 'react';
import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import PageNavigationMenu from '../../../../components/PageNavigationMenu';
import {
  headerContainerStyles,
  headerContentStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  searchWrapperStyles,
  searchIconStyles,
  searchInputStyles
} from '../../../../styles/stock/stockStyles';

const StockPageHeader = ({
  isMobile,
  searchValue,
  onSearchChange,
  user,
  currentPath
}) => (
  <Box sx={headerContainerStyles(isMobile)}>
    <Box sx={headerContentStyles}>
      <Box sx={headerTitleWrapperStyles}>
        <Typography variant="h4" sx={headerTitleStyles}>
          Stock por Posición
        </Typography>

        <Box sx={searchWrapperStyles}>
          <SearchIcon sx={searchIconStyles} />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar..."
            style={searchInputStyles}
          />
        </Box>
      </Box>

      <PageNavigationMenu user={user} currentPath={currentPath} />
    </Box>
  </Box>
);

export default StockPageHeader;

