import { useEffect, useState, useCallback } from 'react';
import { offlineStorage } from '../utils/offlineStorage';
import { supabase } from '../supabaseClient';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    try {
      // CORRECCIÓN: Usamos 'getTransactions' que es el método real de tu offlineStorage
      const pendingTx = await offlineStorage.getTransactions();
      if (pendingTx.length === 0) return;

      setIsSyncing(true);
      console.log(`[Offline Sync] Detectadas ${pendingTx.length} transacciones pendientes.`);

      for (const tx of pendingTx) {
        const { id, action, id_uuid, ...payload } = tx;

        let error = null;

        // Sincronizamos según la acción en cola
        if (action === 'create') {
          const { error: insertError } = await supabase
            .from('transactions')
            .insert([{ id: id_uuid, ...payload }]);
          error = insertError;
        } else if (action === 'update') {
          const { error: updateError } = await supabase
            .from('transactions')
            .update(payload)
            .eq('id', id_uuid);
          error = updateError;
        } else if (action === 'delete') {
          const { error: deleteError } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id_uuid);
          error = deleteError;
        }

        if (!error) {
          // Sincronización exitosa -> Eliminamos de la cola de IndexedDB
          if (id !== undefined) {
            await offlineStorage.deleteTransaction(id);
          }
        } else {
          console.error(`[Offline Sync] Error sincronizando acción '${action}':`, error.message);
        }
      }
      
      console.log('[Offline Sync] Proceso de sincronización completado.');
    } catch (err) {
      console.error('[Offline Sync] Fallo general en la sincronización:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncOfflineData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineData]);

  return { isOnline, isSyncing, syncOfflineData };
}