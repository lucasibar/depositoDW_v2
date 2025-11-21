import { useCallback, useState } from 'react';
import { NOTIFICATION_INITIAL_STATE } from '../constants/stockPageConstants';

export const useNotification = () => {
  const [notification, setNotification] = useState(NOTIFICATION_INITIAL_STATE);

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return { notification, showNotification, closeNotification };
};

