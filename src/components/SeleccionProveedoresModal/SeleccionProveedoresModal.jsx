import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CircularProgress,
    IconButton,
    TextField,
    InputAdornment,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Business as BusinessIcon,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { dashboardComprasService } from '../../services/dashboardComprasService';

export const SeleccionProveedoresModal = ({
    open,
    onClose,
    proveedoresSeleccionadosIniciales,
    onGuardar
}) => {
    const [proveedores, setProveedores] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            cargarProveedores();
            setSeleccionados(proveedoresSeleccionadosIniciales || []);
        }
    }, [open, proveedoresSeleccionadosIniciales]);

    const cargarProveedores = async () => {
        try {
            setLoading(true);
            const data = await dashboardComprasService.obtenerProveedores();
            setProveedores(data);
        } catch (error) {
            setError('Error al cargar proveedores');
            console.error('Error cargando proveedores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (id) => {
        setSeleccionados(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (seleccionados.length === proveedores.length) {
            setSeleccionados([]);
        } else {
            setSeleccionados(proveedores.map(p => p.id));
        }
    };

    const handleGuardar = async () => {
        try {
            setLoading(true);
            await dashboardComprasService.guardarFiltros(seleccionados);
            onGuardar(seleccionados);
            onClose();
        } catch (error) {
            setError('Error al guardar los filtros');
        } finally {
            setLoading(false);
        }
    };

    const filteredProveedores = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Seleccionar Proveedores</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent divider>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {seleccionados.length} seleccionados de {proveedores.length}
                    </Typography>
                    <Button size="small" onClick={handleSelectAll}>
                        {seleccionados.length === proveedores.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                    </Button>
                </Box>

                <Divider />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={30} />
                    </Box>
                ) : (
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {filteredProveedores.map((p) => (
                            <ListItem
                                key={p.id}
                                dense
                                button
                                onClick={() => handleToggle(p.id)}
                                divider
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={seleccionados.includes(p.id)}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={p.nombre}
                                    secondary={p.rut ? `RUT: ${p.rut}` : null}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleGuardar}
                    disabled={loading}
                >
                    Aplicar y Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
