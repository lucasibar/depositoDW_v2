
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Autocomplete,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Card,
    CardContent,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Alert,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    ShoppingCart as CartIcon
} from '@mui/icons-material';
import { dashboardComprasService } from '../../services/dashboardComprasService';
import { consultaStockService } from '../../services/consultaStockService';
import { pedidosService } from '../../services/pedidosService';
import Swal from 'sweetalert2';

export const GenerarPedido = () => {
    const theme = useTheme();

    // Estado Header
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [observaciones, setObservaciones] = useState('');

    // Estado Item Entry
    const [proveedores, setProveedores] = useState([]);
    const [allItems, setAllItems] = useState([]); // Todos los items cargados
    const [items, setItems] = useState([]); // Items filtrados por proveedor
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [kilosPedidos, setKilosPedidos] = useState('');
    const [consultando, setConsultando] = useState(false);
    const [consultaResult, setConsultaResult] = useState(null);

    // Estado Pedido
    const [pedidoItems, setPedidoItems] = useState([]);
    const [guardando, setGuardando] = useState(false);

    // Initial Load
    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    // Filter Items on Provider Change
    useEffect(() => {
        if (selectedProveedor) {
            const itemsFiltrados = allItems.filter(item => item.proveedor?.id === selectedProveedor.id);
            setItems(itemsFiltrados);
        } else {
            setItems([]);
        }
        setSelectedItem(null);
        setConsultaResult(null);
    }, [selectedProveedor, allItems]);

    const cargarDatosIniciales = async () => {
        try {
            const [allProvs, todosLosItems] = await Promise.all([
                dashboardComprasService.obtenerProveedores(),
                dashboardComprasService.obtenerTodosLosItems()
            ]);

            // Filtrar clientes y proveedores
            const listaClientes = allProvs.filter(p => p.categoria === 'cliente');
            const listaProveedores = allProvs.filter(p => p.categoria === 'proveedor');

            setClientes(listaClientes);
            setProveedores(listaProveedores);
            setAllItems(todosLosItems);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    const handleConsultar = async () => {
        if (!selectedItem || !kilosPedidos) return null;

        setConsultando(true);
        try {
            const res = await consultaStockService.obtenerDisponibilidad(selectedItem.id, parseFloat(kilosPedidos));
            setConsultaResult(res);
            return res;
        } catch (error) {
            console.error("Error consultando stock:", error);
            Swal.fire('Error', 'No se pudo consultar el stock', 'error');
            return null;
        } finally {
            setConsultando(false);
        }
    }

    const handleAgregarItem = async () => {
        if (!selectedItem || !kilosPedidos) return;

        let resultadoStock = consultaResult;

        // Si no se ha consultado o cambió el valor, consultar ahora
        if (!resultadoStock) {
            resultadoStock = await handleConsultar();
        }

        if (!resultadoStock) return; // Si falló la consulta

        const newItem = {
            id: Date.now(),
            itemId: selectedItem.id,
            itemDescripcion: selectedItem.descripcion,
            proveedorNombre: selectedProveedor?.nombre,
            kilosSolicitados: parseFloat(kilosPedidos),
            stockAlMomento: resultadoStock.totalStock,
            colorStatus: resultadoStock.colorStatus,
            proximaPosicion: resultadoStock.proximaPosicion
        };

        setPedidoItems([...pedidoItems, newItem]);

        // Reset inputs, pero MANTENER el proveedor
        setSelectedItem(null);
        setKilosPedidos('');
        setConsultaResult(null);

        // Foco opcional en el selector de items si fuera posible, pero por ahora suficiente con limpiar
    };

    const handleEliminarItem = (id) => {
        setPedidoItems(pedidoItems.filter(i => i.id !== id));
    };

    const handleGuardarPedido = async () => {
        if (!selectedCliente || pedidoItems.length === 0) {
            Swal.fire('Atención', 'Seleccione un cliente y agregue al menos un item.', 'warning');
            return;
        }

        setGuardando(true);
        try {
            const pedidoData = {
                clienteId: selectedCliente.id,
                fecha: fecha,
                observaciones: observaciones,
                items: pedidoItems
            };

            await pedidosService.crearPedido(pedidoData);

            Swal.fire('Éxito', 'Pedido generado correctamente', 'success');

            // Reset Form completelly
            setPedidoItems([]);
            setSelectedCliente(null);
            setObservaciones('');
            setSelectedItem(null);
            setConsultaResult(null);
            setKilosPedidos('');

        } catch (error) {
            console.error("Error guardando pedido:", error);
            Swal.fire('Error', 'Hubo un error al guardar el pedido', 'error');
        } finally {
            setGuardando(false);
        }
    };

    const getColor = (status) => {
        switch (status) {
            case 'GREEN': return theme.palette.success.main;
            case 'YELLOW': return theme.palette.warning.main;
            case 'RED': return theme.palette.error.main;
            default: return theme.palette.text.primary;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Header: Cliente y Datos Generales */}
                <Grid item xs={12}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Destino del Pedido
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <Autocomplete
                                        options={clientes}
                                        getOptionLabel={(option) => option.nombre}
                                        value={selectedCliente}
                                        onChange={(e, val) => setSelectedCliente(val)}
                                        renderInput={(params) => <TextField {...params} label="Cliente / Destino" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        type="date"
                                        label="Fecha"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Observaciones"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Lista de Items del Pedido */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Planilla de Pedido</Typography>
                        </Box>

                        <TableContainer sx={{ flexGrow: 1 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="25%">Proveedor</TableCell>
                                        <TableCell width="35%">Item</TableCell>
                                        <TableCell width="15%" align="right">Solicitado (Kg)</TableCell>
                                        <TableCell width="15%" align="right">Stock</TableCell>
                                        <TableCell width="10%" align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Fila de Entrada de Datos (Siempre visible al principio) */}
                                    <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                                        <TableCell>
                                            <Autocomplete
                                                options={proveedores}
                                                getOptionLabel={(option) => option.nombre}
                                                value={selectedProveedor}
                                                onChange={(e, val) => setSelectedProveedor(val)}
                                                renderInput={(params) => <TextField {...params} placeholder="Proveedor" size="small" variant="outlined" sx={{ bgcolor: 'white' }} />}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Autocomplete
                                                options={items}
                                                getOptionLabel={(option) => `${option.descripcion} ${option.categoria ? `(${option.categoria})` : ''}`}
                                                value={selectedItem}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                onChange={(e, val) => setSelectedItem(val)}
                                                disabled={!selectedProveedor}
                                                renderInput={(params) => <TextField {...params} placeholder="Seleccionar Item" size="small" variant="outlined" sx={{ bgcolor: 'white' }} />}
                                                renderOption={(props, option) => {
                                                    const { key, ...otherProps } = props;
                                                    return (
                                                        <li key={option.id} {...otherProps}>
                                                            {option.descripcion} {option.categoria ? `(${option.categoria})` : ''}
                                                        </li>
                                                    );
                                                }}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                value={kilosPedidos}
                                                onChange={(e) => setKilosPedidos(e.target.value)}
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        await handleAgregarItem();
                                                    }
                                                }}
                                                placeholder="Kg"
                                                size="small"
                                                fullWidth
                                                sx={{ bgcolor: 'white' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {consultando ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    consultaResult && (
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: getColor(consultaResult.colorStatus) }}>
                                                            {consultaResult.totalStock}
                                                        </Typography>
                                                    )
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={handleAgregarItem}
                                                disabled={!selectedItem || !kilosPedidos}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                    {pedidoItems.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.proveedorNombre}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{item.itemDescripcion}</TableCell>
                                            <TableCell align="right">{item.kilosSolicitados}</TableCell>
                                            <TableCell align="right" sx={{ color: getColor(item.colorStatus), fontWeight: 'bold' }}>
                                                {item.stockAlMomento}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" onClick={() => handleEliminarItem(item.id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                startIcon={guardando ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleGuardarPedido}
                                disabled={guardando || pedidoItems.length === 0}
                                sx={{ borderRadius: 2, px: 4 }}
                            >
                                {guardando ? 'Guardando...' : 'Guardar Planilla'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
