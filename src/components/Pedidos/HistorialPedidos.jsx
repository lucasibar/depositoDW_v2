
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
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';
import { Visibility as VisibilityIcon, Event as EventIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { pedidosService } from '../../services/pedidosService';
import Swal from 'sweetalert2';

export const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidosService.obtenerPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = async (pedido) => {
        // Podríamos hacer un fetch específico si los items no vienen en el lista, 
        // pero mi servicio findAll trae las relaciones.
        setSelectedPedido(pedido);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedPedido(null);
    };

    const handleEliminarPedido = async (id) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await pedidosService.eliminarPedido(id);
                setPedidos(pedidos.filter(p => p.id !== id));
                Swal.fire(
                    'Eliminado!',
                    'El pedido ha sido eliminado.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error eliminando pedido:", error);
            Swal.fire('Error', 'No se pudo eliminar el pedido', 'error');
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Cliente / Destino</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pedidos.map((pedido) => (
                                <TableRow key={pedido.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EventIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            {new Date(pedido.fecha).toLocaleDateString()}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{pedido.cliente?.nombre || 'Sin Cliente'}</TableCell>
                                    <TableCell>{pedido.items?.length || 0} items</TableCell>
                                    <TableCell>
                                        <Chip label={pedido.estado} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleVerDetalle(pedido)} sx={{ mr: 1 }}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleEliminarPedido(pedido.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pedidos.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        No hay pedidos registrados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialogo de Detalle */}
            <Dialog
                open={detailOpen}
                onClose={handleCloseDetail}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                {selectedPedido && (
                    <>
                        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                            Detalle del Pedido
                            <Typography variant="subtitle2" color="text.secondary">
                                {selectedPedido.cliente?.nombre} - {new Date(selectedPedido.fecha).toLocaleDateString()}
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ mt: 2 }}>
                            {selectedPedido.observaciones && (
                                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="caption" fontWeight="bold">Observaciones:</Typography>
                                    <Typography variant="body2">{selectedPedido.observaciones}</Typography>
                                </Box>
                            )}

                            <TableContainer component={Paper} elevation={0} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Proveedor</TableCell>
                                            <TableCell>Item</TableCell>
                                            <TableCell>Material / Categoría</TableCell>
                                            <TableCell align="right">Kg Solicitados</TableCell>
                                            <TableCell align="center">Stock (Histórico)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedPedido.items?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.item?.proveedor?.nombre || '-'}</TableCell>
                                                <TableCell>{item.item?.descripcion}</TableCell>
                                                <TableCell>{item.item?.categoria || '-'}{item.item?.material ? ` / ${item.item.material}` : ''}</TableCell>
                                                <TableCell align="right">{item.kilosSolicitados}</TableCell>
                                                <TableCell align="center">
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: item.colorStatus === 'GREEN' ? '#2e7d32' : item.colorStatus === 'YELLOW' ? '#ed6c02' : '#d32f2f'
                                                        }}
                                                    >
                                                        {item.stockAlMomento}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Aquí podríamos mostrar la próxima posición guardada si es relevante */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetail}>Cerrar</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};
