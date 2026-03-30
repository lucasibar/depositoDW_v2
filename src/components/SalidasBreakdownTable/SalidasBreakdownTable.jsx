import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Scale as ScaleIcon,
  Functions as SummarizeIcon
} from '@mui/icons-material';

export const SalidasBreakdownTable = ({ dataset, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!dataset) return [];
    if (!searchTerm) return dataset;

    const term = searchTerm.toLowerCase();
    return dataset.filter(mov => 
      (mov.item?.descripcion?.toLowerCase().includes(term)) ||
      (mov.cliente?.nombre?.toLowerCase().includes(term)) ||
      (mov.partida?.numeroPartida?.toLowerCase().includes(term))
    );
  }, [dataset, searchTerm]);

  const totalKilos = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (curr.kilos || 0), 0);
  }, [filteredData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dataset || dataset.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Typography color="text.secondary">No se encontraron movimientos de salida en este período.</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Table Header with Search and Stats */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <TextField
          size="small"
          placeholder="Buscar en el desglose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Paper sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          px: 3, 
          py: 1, 
          borderRadius: 2,
          bgcolor: 'primary.light',
          color: 'white',
          boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)'
        }}>
          <SummarizeIcon fontSize="small" />
          <Box>
            <Typography variant="caption" sx={{ display: 'block', opacity: 0.9, lineHeight: 1, mb: 0.5 }}>
              TOTAL FILTRADO
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {totalKilos.toFixed(2)}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>KG</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Partida</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Kilos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((mov) => (
              <TableRow key={mov.id} hover>
                <TableCell>{new Date(mov.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{mov.cliente?.nombre || 'N/A'}</TableCell>
                <TableCell>{mov.item?.descripcion || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={mov.item?.categoria || 'Sin Cat.'} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell>{mov.partida?.numeroPartida || 'N/A'}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {mov.kilos?.toFixed(2)} kg
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No se encontraron items que coincidan con la búsqueda.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
