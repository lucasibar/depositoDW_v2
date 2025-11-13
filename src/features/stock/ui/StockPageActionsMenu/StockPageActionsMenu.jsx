import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import {
  Edit as EditIcon,
  LocalShipping as LocalShippingIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';
import { MENU_ANCHOR_ORIGIN, MENU_TRANSFORM_ORIGIN } from '../../constants/stockPageConstants';

const StockPageActionsMenu = ({ anchorEl, onClose, onAjustar, onMover, onGenerarRemito }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    anchorOrigin={MENU_ANCHOR_ORIGIN}
    transformOrigin={MENU_TRANSFORM_ORIGIN}
  >
    <MenuItem onClick={onAjustar}>
      <EditIcon sx={{ mr: 1 }} />
      Ajustar
    </MenuItem>
    <MenuItem onClick={onMover}>
      <SwapIcon sx={{ mr: 1 }} />
      Mover
    </MenuItem>
    <MenuItem onClick={onGenerarRemito}>
      <LocalShippingIcon sx={{ mr: 1 }} />
      Remito Salida
    </MenuItem>
  </Menu>
);

export default StockPageActionsMenu;

