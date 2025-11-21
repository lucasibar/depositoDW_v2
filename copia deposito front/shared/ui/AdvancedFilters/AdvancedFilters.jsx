import React from "react";
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { ADVANCED_FILTERS } from "../../../features/stock/constants/stockConstants";

export const AdvancedFilters = ({ 
  filters, 
  onFilterChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const racks = Array.from({ length: ADVANCED_FILTERS.RACK.MAX }, (_, i) => i + ADVANCED_FILTERS.RACK.MIN);
  const filas = Array.from({ length: ADVANCED_FILTERS.FILA.MAX }, (_, i) => i + ADVANCED_FILTERS.FILA.MIN);
  const abOptions = ADVANCED_FILTERS.AB.OPTIONS;
  const pasillos = Array.from({ length: ADVANCED_FILTERS.PASILLO.MAX }, (_, i) => i + ADVANCED_FILTERS.PASILLO.MIN);

  const handleFilterChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: isMobile ? 0.125 : isTablet ? 0.25 : 1,
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Rack */}
      <FormControl size="small" sx={{ 
        minWidth: isMobile ? 30 : isTablet ? 35 : 60, 
        flex: '1 1 0',
        '& .MuiSelect-select': {
          textAlign: 'center'
        }
      }}>
        <Select
          value={filters.rack || ''}
          onChange={(e) => handleFilterChange('rack', e.target.value)}
          displayEmpty
          sx={{
            height: isMobile ? 40 : isTablet ? 44 : 48,
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.875rem',
            '& .MuiSelect-select': {
              padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px'
            }
          }}
        >
          <MenuItem value="">
            <Typography variant="caption">R</Typography>
          </MenuItem>
          {racks.map(rack => (
            <MenuItem key={rack} value={rack}>
              <Typography variant="caption">R{rack}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Fila */}
      <FormControl size="small" sx={{ 
        minWidth: isMobile ? 30 : isTablet ? 35 : 60, 
        flex: '1 1 0',
        '& .MuiSelect-select': {
          textAlign: 'center'
        }
      }}>
        <Select
          value={filters.fila || ''}
          onChange={(e) => handleFilterChange('fila', e.target.value)}
          displayEmpty
          sx={{
            height: isMobile ? 40 : isTablet ? 44 : 48,
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.875rem',
            '& .MuiSelect-select': {
              padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px'
            }
          }}
        >
          <MenuItem value="">
            <Typography variant="caption">F</Typography>
          </MenuItem>
          {filas.map(fila => (
            <MenuItem key={fila} value={fila}>
              <Typography variant="caption">F{fila}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* A/B */}
      <FormControl size="small" sx={{ 
        minWidth: isMobile ? 25 : isTablet ? 30 : 55, 
        flex: '1 1 0',
        '& .MuiSelect-select': {
          textAlign: 'center'
        }
      }}>
        <Select
          value={filters.ab || ''}
          onChange={(e) => handleFilterChange('ab', e.target.value)}
          displayEmpty
          sx={{
            height: isMobile ? 40 : isTablet ? 44 : 48,
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.875rem',
            '& .MuiSelect-select': {
              padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px'
            }
          }}
        >
          <MenuItem value="">
            <Typography variant="caption">A/B</Typography>
          </MenuItem>
          {abOptions.map(ab => (
            <MenuItem key={ab} value={ab}>
              <Typography variant="caption">{ab}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Pasillo */}
      <FormControl size="small" sx={{ 
        minWidth: isMobile ? 35 : isTablet ? 40 : 70, 
        flex: '1 1 0',
        '& .MuiSelect-select': {
          textAlign: 'center'
        }
      }}>
        <Select
          value={filters.pasillo || ''}
          onChange={(e) => handleFilterChange('pasillo', e.target.value)}
          displayEmpty
          sx={{
            height: isMobile ? 40 : isTablet ? 44 : 48,
            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.875rem',
            '& .MuiSelect-select': {
              padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px'
            }
          }}
        >
          <MenuItem value="">
            <Typography variant="caption">P</Typography>
          </MenuItem>
          {pasillos.map(pasillo => (
            <MenuItem key={pasillo} value={pasillo}>
              <Typography variant="caption">P{pasillo}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}; 