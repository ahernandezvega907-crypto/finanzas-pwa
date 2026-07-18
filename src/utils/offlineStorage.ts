const DB_NAME = 'moneyflow_offline_db';
const DB_VERSION = 2; // Elevamos versión para aplicar los nuevos esquemas de almacenamiento local
const STORE_NAME = 'pending_transactions';

export interface QueuedTransaction {
  id?: number;          // Clave autoincremental de IndexedDB
  id_uuid: string;      // ID de la transacción en la UI
  action: 'create' | 'update' | 'delete'; // Define la operación que procesará el Sync Worker
  amount: number;
  type: 'income' | 'expense';
  category_id: string | null;
  date: string;
  description?: string;
  profile_id: string;   // Unificado con el esquema de base de datos de Supabase
  created_at: string;
  updated_at?: string;
}

export const offlineStorage = {
  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // === 1. ENCOLAR CREACIÓN (Action: 'create') ===
  async saveTransaction(tx: Omit<QueuedTransaction, 'id' | 'action'>): Promise<number> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const payload: Omit<QueuedTransaction, 'id'> = {
        ...tx,
        action: 'create',
      };
      
      const request = store.add(payload);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  },

  // === 2. ENCOLAR ACTUALIZACIÓN (Action: 'update') ===
  async queueUpdateTransaction(tx: {
    id_uuid: string;
    amount: number;
    type: 'income' | 'expense';
    category_id: string | null;
    date: string;
    description: string;
    updated_at: string;
  }): Promise<number> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const payload: Omit<QueuedTransaction, 'id'> = {
        id_uuid: tx.id_uuid,
        action: 'update',
        amount: tx.amount,
        type: tx.type,
        category_id: tx.category_id,
        date: tx.date,
        description: tx.description,
        profile_id: '', // Será procesado por el Worker usando el contexto de sesión
        created_at: tx.updated_at,
        updated_at: tx.updated_at
      };

      const request = store.add(payload);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  },

  // === 3. ENCOLAR ELIMINACIÓN (Action: 'delete') ===
  async queueDeleteTransaction(id_uuid: string): Promise<number> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const payload: Omit<QueuedTransaction, 'id'> = {
        id_uuid,
        action: 'delete',
        amount: 0,
        type: 'expense',
        category_id: null,
        date: new Date().toISOString().split('T')[0],
        profile_id: '',
        created_at: new Date().toISOString()
      };

      const request = store.add(payload);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  },

  // === 4. OBTENER TODA LA COLA DE TRABAJO PENDIENTE ===
  async getTransactions(): Promise<QueuedTransaction[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // === 5. CONFIRMAR / LIMPIAR DE LA COLA TRAS LA SINCRONIZACIÓN EXITOSA ===
  async deleteTransaction(id: number): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};