import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import {
  positionDetailContainerStyles,
  positionDetailEmptyStyles,
  positionDetailHeaderStyles,
  addButtonStyles,
  itemContainerStyles,
  positionDetailTitleStyles,
  positionDetailSubtitleStyles,
  itemHeaderStyles,
  itemTitleStyles,
  partidaRowStyles,
  partidaActionButtonStyles
} from '../../../../styles/stock/stockStyles';
import { getPosLabel } from '../../../../utils/posicionUtils';

const StockPagePositionDetail = ({
  position,
  loading,
  itemMatchesSearch,
  onOpenMenu,
  onOpenAdicionRapida
}) => {
  if (!position && !loading) {
    return (
      <Box sx={positionDetailEmptyStyles}>
        <Typography color="text.secondary">
          Selecciona una posición para ver su composición
        </Typography>
      </Box>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <Box sx={positionDetailContainerStyles}>
      <Box sx={positionDetailHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={positionDetailTitleStyles}>
            {getPosLabel(position.posicion)}
          </Typography>
          <Typography variant="body2" sx={positionDetailSubtitleStyles}>
            {(position.items?.length || 0)} items en esta posición
          </Typography>
        </Box>

        <IconButton
          onClick={() => onOpenAdicionRapida(position.posicion)}
          sx={addButtonStyles}
          title="Adición Rápida"
        >
          <AddIcon />
        </IconButton>
      </Box>

      {(position.items || []).map((itemWrapper, itemIndex) => {
        const isHighlighted = itemMatchesSearch(itemWrapper);

        return (
          <Box
            key={`${itemWrapper.item?.id || itemIndex}`}
            sx={itemContainerStyles(isHighlighted)}
          >
            <Box sx={itemHeaderStyles}>
              <Typography variant="subtitle1" sx={itemTitleStyles}>
                {itemWrapper.item?.categoria || 'Sin categoría'} -{' '}
                {itemWrapper.item?.descripcion || 'Sin descripción'} -{' '}
                {itemWrapper.item?.proveedor?.nombre || 'Sin proveedor'}
              </Typography>
            </Box>

            {(itemWrapper.partidas || []).map((partida, partidaIndex) => (
              <Box
                key={`${partida.id}-${partida.numeroPartida}-${partidaIndex}`}
                sx={partidaRowStyles}
              >
                <Typography variant="body2" color="text.secondary">
                  Partida: {partida.numeroPartida} -{' '}
                  <span style={{ color: '#1976D2', fontWeight: 600 }}>
                    {partida.kilos} kg
                  </span>{' '}
                  -{' '}
                  <span style={{ color: '#7B1FA2', fontWeight: 600 }}>
                    {partida.unidades} un
                  </span>
                </Typography>

                <IconButton
                  onClick={(event) =>
                    onOpenMenu(event, itemWrapper.item, partida, position.posicion)
                  }
                  size="small"
                  sx={partidaActionButtonStyles}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default StockPagePositionDetail;

