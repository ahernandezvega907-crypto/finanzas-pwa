import { openDB, DBSchema } from 'idb';
import { Transaction } from '../types';

interface MoneyFlowDB extends DBSchema {
  pending_transactions: {
    key: string;
    value: Omit<Transaction, 'id'> & { tempId: string; created_at: string };
  };
}

const DB_NAME = 'moneyflow-offline-db';
const STORE_NAME = 'pending_transactions';

export const initDB = async () => {
  return openDB<MoneyFlowDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'tempId' });
      }
    },
  });
};

// Guarda transacciones localmente sin conexión
export const savePendingTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const db = await initDB();
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const record = { ...transaction, tempId, created_at: new Date().toISOString() };
  await db.put(STORE_NAME, record);
  return record;
};

// Obtiene la lista de transacciones pendientes
export const getPendingTransactions = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Elimina una transacción de la cola local tras enviarla con éxito a Supabase
export const clearPendingTransaction = async (tempId: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, tempId);
};