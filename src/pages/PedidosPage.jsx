
import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, Typography } from '@mui/material';
import { GenerarPedido } from '../components/Pedidos/GenerarPedido';
import { HistorialPedidos } from '../components/Pedidos/HistorialPedidos';
import { Description as DescriptionIcon, History as HistoryIcon } from '@mui/icons-material';

export const PedidosPage = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 10 }}>
            {/* Header Area */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', pt: 3, px: 3 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                        Gestión de Pedidos de Producción
                    </Typography>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ mt: 2 }}
                    >
                        <Tab icon={<DescriptionIcon />} iconPosition="start" label="Nuevo Pedido" />
                        <Tab icon={<HistoryIcon />} iconPosition="start" label="Historial de Pedidos" />
                    </Tabs>
                </Container>
            </Box>

            {/* Content Area */}
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {tabIndex === 0 && <GenerarPedido />}
                {tabIndex === 1 && <HistorialPedidos />}
            </Container>
        </Box>
    );
};
