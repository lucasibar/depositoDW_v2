import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  positionsListContainerStyles,
  positionCardStyles,
  positionCardTitleStyles
} from '../../../../styles/stock/stockStyles';
import { getPosLabel } from '../../../../utils/posicionUtils';

const StockPagePositionsList = ({
  positions,
  loading,
  error,
  selectedIndex,
  onSelectPosition
}) => (
  <Box sx={positionsListContainerStyles}>
    {loading && <Typography>Cargando...</Typography>}
    {error && <Typography color="error">{error}</Typography>}

    {!loading &&
      positions.map((position, index) => (
        <Box
          key={position.posicion?.id || index}
          onClick={() => onSelectPosition(index)}
          sx={positionCardStyles(index === selectedIndex)}
        >
          <Typography variant="subtitle1" sx={positionCardTitleStyles}>
            {getPosLabel(position.posicion)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(position.items?.length || 0)} items
          </Typography>
        </Box>
      ))}
  </Box>
);

export default StockPagePositionsList;

