import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box
} from '@mui/material';

const AutocompleteSelect = ({
  label,
  value,
  onChange,
  options = [],
  getOptionLabel,
  getOptionKey,
  filterOptions,
  loading = false,
  size = "small",
  sx = {},
  extraOption = null, // Nueva prop para opción adicional
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Función para encontrar la opción correcta basada en el valor
  const findOptionByValue = (value) => {
    if (!value) return null;
    
    // Si value es un objeto, buscar por el objeto completo
    if (typeof value === 'object' && value !== null) {
      return options.find(option => option.id === value.id) || null;
    }
    
    // Si value es un string, buscar por el label
    return options.find(option => getOptionLabel(option) === value) || null;
  };

  useEffect(() => {
    const option = findOptionByValue(value);
    if (option) {
      setInputValue(getOptionLabel(option));
    } else {
      setInputValue('');
    }
  }, [value, options, getOptionLabel]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    if (newValue) {
      const label = getOptionLabel(newValue);
      onChange(newValue); // Pasar el objeto completo
      setInputValue(label);
    } else {
      onChange(null);
      setInputValue('');
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={findOptionByValue(value)}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={extraOption ? [extraOption, ...options] : options}
      getOptionLabel={(option) => {
        if (extraOption && option === extraOption) {
          return ''; // La opción adicional se renderiza personalmente
        }
        return getOptionLabel(option);
      }}
      getOptionKey={getOptionKey}
      filterOptions={filterOptions}
      loading={loading}
      size={size}
      sx={{
        '& .MuiInputBase-root': { 
          height: '28px',
          fontSize: '11px'
        },
        '& .MuiInputLabel-root': {
          fontSize: '10px'
        },
        '& .MuiInputLabel-shrink': {
          fontSize: '9px'
        },
        // Estilos para las opciones del dropdown
        '& .MuiAutocomplete-listbox': {
          fontSize: '12px',
          padding: '4px 0'
        },
        '& .MuiAutocomplete-option': {
          fontSize: '12px',
          padding: '6px 12px',
          minHeight: '32px'
        },
        // Posicionamiento del dropdown
        '& .MuiAutocomplete-popper': {
          zIndex: 1300
        },
        '& .MuiPaper-root': {
          maxWidth: '100%',
          overflow: 'hidden',
          width: 'auto !important'
        },
        '& .MuiAutocomplete-listbox': {
          fontSize: '12px',
          padding: '4px 0',
          maxWidth: '100%'
        },
        ...sx
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        
        // Si es la opción adicional, renderizar el componente personalizado
        if (extraOption && option === extraOption) {
          return (
            <Box 
              component="li" 
              key="extra-option"
              {...otherProps} 
              sx={{ 
                fontSize: '12px', 
                py: 0.5,
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5'
              }}
            >
              {extraOption}
            </Box>
          );
        }
        
        // Generar una key única que incluya el ID para evitar duplicados
        const uniqueKey = option.id ? `option-${option.id}` : `option-${getOptionLabel(option)}-${Math.random()}`;
        
        return (
          <Box 
            component="li" 
            key={uniqueKey}
            {...otherProps} 
            sx={{ fontSize: '12px', py: 0.5 }}
          >
            {getOptionLabel(option)}
          </Box>
        );
      }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                tether: false,
                rootBoundary: 'viewport'
              }
            },
            {
              name: 'flip',
              enabled: true,
              options: {
                fallbackPlacements: ['top', 'bottom']
              }
            }
          ]
        }
      }}
      {...props}
    />
  );
};

export default AutocompleteSelect;
