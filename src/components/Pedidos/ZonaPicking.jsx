import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Grid,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Alert
} from '@mui/material';
import { pedidosService } from '../../services/pedidosService';

export const ZonaPicking = () => {
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [pickingStats, setPickingStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarStats();
    }, [fecha]);

    const cargarStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await pedidosService.obtenerPickingStats(fecha);
            setPickingStats(data);
        } catch (err) {
            setError("Error al cargar los datos de picking.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Agrupar por categoría
    const groupedStats = pickingStats.reduce((acc, item) => {
        const cat = item.categoria || 'Sin Categoría';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(item);
        return acc;
    }, {});

    const renderTable = (categoria, items) => (
        <Grid item xs={12} md={6} lg={4} key={categoria}>
            <Card elevation={3} sx={{ height: '100%' }}>
                <CardHeader
                    title={categoria.toUpperCase()}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        py: 1,
                        '& .MuiTypography-root': { fontSize: '1.1rem', fontWeight: 'bold' }
                    }}
                />
                <CardContent sx={{ p: 0 }}>
                    <TableContainer sx={{ maxHeight: 300 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Material</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Pedidos (Kg)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Stock Picking</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ubic. Picking</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Prox. Material</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell component="th" scope="row">
                                            {item.item}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">
                                                {item.kilosPedidos}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold" color={parseFloat(item.stockPicking) >= parseFloat(item.kilosPedidos) ? 'success.main' : 'warning.main'}>
                                                {item.stockPicking}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{item.ubicacionPicking}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                            {item.proximoMaterial}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    label="Fecha de Pedidos"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: 200 }}
                />
                {loading && <CircularProgress size={24} />}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && pickingStats.length === 0 && !error ? (
                <Alert severity="info">No hay pedidos para la fecha seleccionada.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {Object.entries(groupedStats).map(([categoria, items]) => renderTable(categoria, items))}
                </Grid>
            )}
        </Box>
    );
};
