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
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const option = options.find(opt => getOptionLabel(opt) === value);
      if (option) {
        setInputValue(getOptionLabel(option));
      }
    }
  }, [value, options, getOptionLabel]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (event, newValue) => {
    if (newValue) {
      const label = getOptionLabel(newValue);
      onChange(label);
      setInputValue(label);
    } else {
      onChange('');
      setInputValue('');
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value ? options.find(option => getOptionLabel(option) === value) || null : null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={getOptionLabel}
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
        return (
          <Box 
            component="li" 
            key={getOptionKey ? getOptionKey(option) : key}
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
