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
    Chip,
    Divider
} from '@mui/material';

export const StockPorPartidaTable = ({ data, loading }) => {
    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">Cargando datos agrupados...</Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    Selecciona proveedores para ver el detalle de materiales por partida
                </Typography>
            </Box>
        );
    }

    // Agrupar los datos por material + descripción en una sola lista plana de tablas
    const groupedList = data.reduce((acc, row) => {
        const material = row.material || 'otros';
        const descripcion = row.descripcion || 'Sin descripción';
        const key = `${material}_${descripcion}`;

        if (!acc[key]) {
            acc[key] = {
                material,
                descripcion,
                rows: []
            };
        }
        acc[key].rows.push(row);
        return acc;
    }, {});

    const materialNames = {
        'algodon': 'Algodón',
        'algodon-color': 'Algodón Color',
        'nylon': 'Nylon',
        'nylon-color': 'Nylon Color',
        'laicra': 'Lycra',
        'lycra': 'Lycra',
        'goma': 'Goma',
        'costura': 'Costura',
        // ... agregar otros si es necesario
    };

    const formatMaterialName = (id) => {
        if (materialNames[id]) return materialNames[id];
        // Capitalizar si no está en el mapa
        return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
    };

    // Ordenar la lista: primero por material, luego por descripción
    const sortedGroups = Object.values(groupedList).sort((a, b) => {
        if (a.material !== b.material) return a.material.localeCompare(b.material);
        return a.descripcion.localeCompare(b.descripcion);
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sortedGroups.map((group, groupIdx) => (
                <Box key={`${group.material}-${group.descripcion}-${groupIdx}`}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: 'primary.main',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Box component="span" sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                        {formatMaterialName(group.material)} - {group.descripcion}
                    </Typography>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Partida</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Kilos</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Unidades (Cajas)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.rows.map((row, index) => (
                                    <TableRow
                                        key={`${row.proveedorNombre}-${row.numeroPartida}-${index}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <TableCell>{row.proveedorNombre}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.numeroPartida}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="bold" color="primary.dark">
                                                {Number(row.totalKilos).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="bold">
                                                {Number(row.totalCajas).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableHead sx={{ bgcolor: 'action.selected' }}>
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold', pl: 2 }}>
                                        TOTAL {group.descripcion.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.dark', fontSize: '1rem' }}>
                                        {Number(group.rows.reduce((sum, row) => sum + Number(row.totalKilos), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                        {Number(group.rows.reduce((sum, row) => sum + Number(row.totalCajas), 0)).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Box>
    );
};
