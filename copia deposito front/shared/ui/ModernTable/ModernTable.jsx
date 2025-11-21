import React from 'react';
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
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const ModernTable = ({
  columns = [],
  data = [],
  title,
  subtitle,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  onRowClick,
  actions = [],
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const renderCell = (column, value, row) => {
    if (column.render) {
      return column.render(value, row);
    }

    if (column.type === 'chip') {
      return (
        <Chip
          label={value}
          size="small"
          color={column.chipColor || 'primary'}
          variant={column.chipVariant || 'filled'}
        />
      );
    }

    if (column.type === 'status') {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'activo':
          case 'success':
            return 'success';
          case 'inactivo':
          case 'error':
            return 'error';
          case 'pendiente':
          case 'warning':
            return 'warning';
          default:
            return 'default';
        }
      };

      return (
        <Chip
          label={value}
          size="small"
          color={getStatusColor(value)}
          variant="filled"
        />
      );
    }

    if (column.type === 'number') {
      return (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value?.toLocaleString()}
        </Typography>
      );
    }

    if (column.type === 'currency') {
      return (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ${value?.toLocaleString()}
        </Typography>
      );
    }

    return (
      <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
        {value}
      </Typography>
    );
  };

  const renderActions = (row) => {
    if (!actions.length) return null;

    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {actions.map((action, index) => (
          <Tooltip key={index} title={action.tooltip || action.label}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
              sx={{
                color: action.color || 'var(--color-text-secondary)',
                '&:hover': {
                  backgroundColor: action.color ? `${action.color}20` : 'var(--color-divider)'
                }
              }}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 'var(--border-radius-lg)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-sm)',
          ...sx
        }}
      >
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)' }}>
            Cargando datos...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!data.length) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 'var(--border-radius-lg)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-sm)',
          ...sx
        }}
      >
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
            {title || 'Tabla'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: 'var(--border-radius-lg)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        ...sx
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600, mb: subtitle ? 0.5 : 0 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <TableContainer>
        <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--color-divider)' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderBottom: '2px solid var(--color-border)',
                    ...column.headerStyle
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderBottom: '2px solid var(--color-border)',
                    width: '80px'
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                onClick={() => handleRowClick(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick ? {
                    backgroundColor: 'var(--color-divider)',
                    transition: 'var(--transition-fast)'
                  } : {},
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      borderBottom: '1px solid var(--color-border)',
                      ...column.cellStyle
                    }}
                  >
                    {renderCell(column, row[column.key], row)}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell
                    sx={{
                      borderBottom: '1px solid var(--color-border)',
                      width: '80px'
                    }}
                  >
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ModernTable; 