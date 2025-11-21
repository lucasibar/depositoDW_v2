import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const StockPageNotificationSnackbar = ({ notification, onClose }) => (
  <Snackbar
    open={notification.open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={notification.severity} sx={{ width: '100%' }}>
      {notification.message}
    </Alert>
  </Snackbar>
);

export default StockPageNotificationSnackbar;

