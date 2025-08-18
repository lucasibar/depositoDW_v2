import { offlineSyncService } from './offlineSyncService';

let isInitialized = false;

export const initOfflineSync = (store) => {
  if (isInitialized) return;
  
  offlineSyncService.init(store);
  isInitialized = true;
  
  console.log('OfflineSyncService inicializado');
};
