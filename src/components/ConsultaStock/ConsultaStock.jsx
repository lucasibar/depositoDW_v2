
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Divider,
    Paper
} from '@mui/material';
import { Search as SearchIcon, Inventory as InventoryIcon, Business as BusinessIcon, ProductionQuantityLimits as ProductionIcon } from '@mui/icons-material';
import { dashboardComprasService } from '../../services/dashboardComprasService';
import { consultaStockService } from '../../services/consultaStockService';

export const ConsultaStock = () => {
    const [proveedores, setProveedores] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [kilosPedidos, setKilosPedidos] = useState('');
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProvs, setLoadingProvs] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarProveedores();
    }, []);

    useEffect(() => {
        if (selectedProveedor) {
            cargarItems(selectedProveedor.id);
            setSelectedItem(null);
            setResultado(null);
        } else {
            setItems([]);
            setSelectedItem(null);
            setResultado(null);
        }
    }, [selectedProveedor]);

    const cargarProveedores = async () => {
        try {
            setLoadingProvs(true);
            const data = await dashboardComprasService.obtenerProveedores();
            setProveedores(data);
        } catch (err) {
            console.error('Error cargando proveedores:', err);
            setError('Error al cargar la lista de proveedores');
        } finally {
            setLoadingProvs(false);
        }
    };

    const cargarItems = async (proveedorId) => {
        try {
            setLoadingItems(true);
            const data = await dashboardComprasService.obtenerItemsPorProveedor(proveedorId);
            setItems(data);
        } catch (err) {
            console.error('Error cargando items:', err);
            setError('Error al cargar los items del proveedor');
        } finally {
            setLoadingItems(false);
        }
    };

    const handleConsultar = async () => {
        if (!selectedItem || !kilosPedidos) return;

        try {
            setLoading(true);
            setError('');
            setResultado(null);

            const res = await consultaStockService.obtenerDisponibilidad(selectedItem.id, parseFloat(kilosPedidos));
            setResultado(res);
        } catch (err) {
            console.error('Error en consulta:', err);
            setError('Error al consultar la disponibilidad de stock');
        } finally {
            setLoading(false);
        }
    };

    const getColor = (status) => {
        switch (status) {
            case 'GREEN': return '#4caf50'; // Green
            case 'YELLOW': return '#ff9800'; // Orange/Yellow
            case 'RED': return '#f44336'; // Red
            default: return 'text.primary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'GREEN': return 'Stock Suficiente (>15x)';
            case 'YELLOW': return 'Stock Medio (7x - 15x)';
            case 'RED': return 'Stock Crítico (<7x)';
            default: return '';
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4, display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                <ProductionIcon sx={{ mr: 2, fontSize: 40 }} />
                Consulta de Disponibilidad para Producción
            </Typography>

            <Grid container spacing={4}>
                {/* Formulario de Consulta */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Parámetros de Búsqueda
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Autocomplete
                                options={proveedores}
                                getOptionLabel={(option) => option.nombre}
                                value={selectedProveedor}
                                onChange={(event, newValue) => setSelectedProveedor(newValue)}
                                loading={loadingProvs}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Proveedor"
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <BusinessIcon color="action" sx={{ mr: 1 }} />
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loadingProvs ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Autocomplete
                                options={items}
                                getOptionLabel={(option) => `${option.descripcion} ${option.categoria ? `(${option.categoria})` : ''}`}
                                value={selectedItem}
                                onChange={(event, newValue) => setSelectedItem(newValue)}
                                disabled={!selectedProveedor}
                                loading={loadingItems}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Item"
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InventoryIcon color="action" sx={{ mr: 1 }} />
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loadingItems ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <TextField
                                label="Kilos a Producir"
                                type="number"
                                value={kilosPedidos}
                                onChange={(e) => setKilosPedidos(e.target.value)}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    endAdornment: <Typography color="text.secondary">Kg</Typography>
                                }}
                            />

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                onClick={handleConsultar}
                                disabled={!selectedItem || !kilosPedidos || loading}
                                sx={{ mt: 2, height: 50 }}
                            >
                                {loading ? 'Consultando...' : 'Consultar Disponibilidad'}
                            </Button>

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Resultados */}
                <Grid item xs={12} md={7}>
                    {resultado ? (
                        <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" gutterBottom color="text.secondary">
                                    Resultado de la Consulta
                                </Typography>
                                <Divider sx={{ mb: 4 }} />

                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                                                Stock Total Disponible
                                            </Typography>
                                            <Typography
                                                variant="h2"
                                                sx={{
                                                    color: getColor(resultado.colorStatus),
                                                    fontWeight: 'bold',
                                                    my: 1
                                                }}
                                            >
                                                {resultado.totalStock.toLocaleString()} <Typography component="span" variant="h5">Kg</Typography>
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: getColor(resultado.colorStatus),
                                                    fontWeight: 'bold',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 10,
                                                    border: `1px solid ${getColor(resultado.colorStatus)}`,
                                                    display: 'inline-block',
                                                    mt: 1
                                                }}
                                            >
                                                {getStatusText(resultado.colorStatus)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Próxima Posición a Consumir
                                            </Typography>
                                            {resultado.proximaPosicion ? (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            NÚMERO DE PARTIDA
                                                        </Typography>
                                                        <Typography variant="h5" fontWeight="medium">
                                                            {resultado.proximaPosicion.numeroPartida}
                                                        </Typography>
                                                    </Box>

                                                    <Divider sx={{ my: 1 }} />

                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                                        UBICACIÓN
                                                    </Typography>

                                                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Rack: <strong>{resultado.proximaPosicion.posicion.rack}</strong></Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Fila: <strong>{resultado.proximaPosicion.posicion.fila}</strong></Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Nivel: <strong>{resultado.proximaPosicion.posicion.AB}</strong></Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2">Pasillo: <strong>{resultado.proximaPosicion.posicion.pasillo}</strong></Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                                                    No hay posiciones con stock disponibles.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>

                            </CardContent>
                        </Card>
                    ) : (
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#fafafa',
                                borderRadius: 2,
                                border: '2px dashed #e0e0e0',
                                p: 4
                            }}
                        >
                            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                <InventoryIcon sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                                <Typography variant="h6">
                                    Seleccione un item y una cantidad para consultar
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
