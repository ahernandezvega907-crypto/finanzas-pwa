import { supabase } from '../supabaseClient';
import { Transaction, CreateTransactionDTO } from '../types/transaction';
import { Result, Ok, Fail } from '../lib/result';
import { AppError } from '../lib/errors';
import { offlineStorage } from '../utils/offlineStorage';

export interface ITransactionRepository {
  getAllByProfile(profileId: string): Promise<Result<Transaction[]>>;
  create(profileId: string, transaction: CreateTransactionDTO): Promise<Result<Transaction>>;
  update(id: string, transaction: CreateTransactionDTO): Promise<Result<Transaction>>;
  delete(id: string): Promise<Result<void>>;
}

export class SupabaseTransactionRepository implements ITransactionRepository {
  
  async getAllByProfile(profileId: string): Promise<Result<Transaction[]>> {
    // Si estamos offline, intentamos leer desde el caché local en IndexedDB
    if (!navigator.onLine) {
      try {
        const cached = await offlineStorage.getTransactions(); 
        if (cached && cached.length > 0) {
          // Adaptamos las claves de IndexedDB a nuestro modelo de dominio (Transaction) de forma segura
          const domainCached: Transaction[] = cached.map(row => ({
            id: row.id_uuid, // Usamos directamente el id_uuid (string garantizado)
            profile_id: row.profile_id || profileId, // Usamos la propiedad unificada
            category_id: row.category_id, // Usamos la propiedad unificada
            amount: Number(row.amount),
            type: row.type,
            description: row.description || '',
            date: row.date,
            createdAt: row.created_at,
            updated_at: row.updated_at || row.created_at
          }));
          console.log('[Offline Cache] Cargadas transacciones locales.');
          return Ok(domainCached);
        }
      } catch (err) {
        console.warn('Fallo al leer caché local offline:', err);
      }
    }

    // Flujo Online normal
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', profileId)
        .order('date', { ascending: false });

      if (error) {
        return Fail(new AppError('DATABASE_ERROR', error.message, error));
      }

      const domainTransactions: Transaction[] = (data || []).map(row => ({
        id: row.id,
        profile_id: row.profile_id,
        category_id: row.category_id,
        amount: Number(row.amount),
        type: row.type,
        description: row.description,
        date: row.date,
        createdAt: row.created_at,
        updated_at: row.updated_at
      }));

      return Ok(domainTransactions);
    } catch (err: any) {
      return Fail(new AppError('DATABASE_ERROR', err.message || 'Error de red con el servidor.'));
    }
  }

  async create(profileId: string, transaction: CreateTransactionDTO): Promise<Result<Transaction>> {
    const timestamp = new Date().toISOString();

    // INTERCEPCIÓN OFFLINE
    if (!navigator.onLine) {
      const mockUuid = crypto.randomUUID();

      try {
        // Encolamos localmente usando un modelo unificado para que el Sync Worker no falle.
        // Guardamos las columnas exactas que la base de datos de Supabase entiende.
        await offlineStorage.saveTransaction({
          id_uuid: mockUuid,
          amount: transaction.amount,
          type: transaction.type,
          category_id: transaction.category_id, 
          date: transaction.date,
          description: transaction.description || '',
          profile_id: profileId,  // Conservamos el estándar profile_id
          created_at: timestamp
        });

        const offlineCreated: Transaction = {
          id: mockUuid,
          profile_id: profileId,
          category_id: transaction.category_id,
          amount: Number(transaction.amount),
          type: transaction.type,
          description: transaction.description,
          date: transaction.date,
          createdAt: timestamp,
          updated_at: timestamp
        };

        console.log('[Offline Queue] Registro encolado localmente.');
        return Ok(offlineCreated);
      } catch (dbError: any) {
        return Fail(new AppError('DATABASE_ERROR', 'No se pudo encolar localmente: ' + dbError.message));
      }
    }

    // FLUJO ONLINE NORMAL
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          profile_id: profileId,
          category_id: transaction.category_id,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date
        })
        .select()
        .single();

      if (error) {
        return Fail(new AppError('DATABASE_ERROR', error.message, error));
      }

      const created: Transaction = {
        id: data.id,
        profile_id: data.profile_id,
        category_id: data.category_id,
        amount: Number(data.amount),
        type: data.type,
        description: data.description,
        date: data.date,
        createdAt: data.created_at,
        updated_at: data.updated_at
      };

      return Ok(created);
    } catch (err: any) {
      return Fail(new AppError('DATABASE_ERROR', err.message || 'Error de conexión remota.'));
    }
  }

  async update(id: string, transaction: CreateTransactionDTO): Promise<Result<Transaction>> {
    const timestamp = new Date().toISOString();

    // INTERCEPCIÓN OFFLINE PARA MODIFICACIONES
    if (!navigator.onLine) {
      try {
        // Guardamos la intención de actualización localmente
        await offlineStorage.queueUpdateTransaction({
          id_uuid: id,
          amount: transaction.amount,
          type: transaction.type,
          category_id: transaction.category_id,
          date: transaction.date,
          description: transaction.description || '',
          updated_at: timestamp
        });

        // Retornamos un objeto de respuesta con los datos nuevos aplicados
        const offlineUpdated: Transaction = {
          id,
          profile_id: 'offline-cached-profile', // Será sobrescrito en el sync real
          category_id: transaction.category_id,
          amount: Number(transaction.amount),
          type: transaction.type,
          description: transaction.description,
          date: transaction.date,
          createdAt: timestamp,
          updated_at: timestamp
        };

        console.log('[Offline Queue] Modificación encolada localmente.');
        return Ok(offlineUpdated);
      } catch (dbError: any) {
        return Fail(new AppError('DATABASE_ERROR', 'No se pudo guardar modificación localmente: ' + dbError.message));
      }
    }

    // FLUJO ONLINE
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          category_id: transaction.category_id,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return Fail(new AppError('DATABASE_ERROR', error.message, error));
      }

      const updated: Transaction = {
        id: data.id,
        profile_id: data.profile_id,
        category_id: data.category_id,
        amount: Number(data.amount),
        type: data.type,
        description: data.description,
        date: data.date,
        createdAt: data.created_at,
        updated_at: data.updated_at
      };

      return Ok(updated);
    } catch (err: any) {
      return Fail(new AppError('DATABASE_ERROR', err.message || 'Error al conectar con el servidor para actualizar.'));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    // INTERCEPCIÓN OFFLINE PARA ELIMINACIÓN
    if (!navigator.onLine) {
      try {
        await offlineStorage.queueDeleteTransaction(id);
        console.log('[Offline Queue] Intención de eliminación encolada localmente.');
        return Ok(undefined);
      } catch (dbError: any) {
        return Fail(new AppError('DATABASE_ERROR', 'No se pudo marcar eliminación localmente: ' + dbError.message));
      }
    }

    // FLUJO ONLINE
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        return Fail(new AppError('DATABASE_ERROR', error.message, error));
      }

      return Ok(undefined);
    } catch (err: any) {
      return Fail(new AppError('DATABASE_ERROR', err.message || 'Error al conectar con el servidor para eliminar.'));
    }
  }
}