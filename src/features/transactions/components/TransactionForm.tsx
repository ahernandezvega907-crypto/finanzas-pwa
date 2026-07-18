import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, type CreateTransactionInput } from '../../../validation/transaction.schema';
import { Transaction } from '../../../types/transaction';

interface TransactionFormProps {
  onSubmitSuccess: (data: CreateTransactionInput) => void;
  isLoading: boolean;
  transaction?: Transaction | null; 
  onCancelEdit?: () => void;         
}

// Función auxiliar ultra segura para extraer YYYY-MM-DD sin desfase horario (evitando retrocesos de un día)
const getSafeDateString = (dateInput: string | Date): string => {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) throw new Error();
    // Extrae año, mes y día de forma local o directa del string si viene en formato ISO estándar
    const datePart = typeof dateInput === 'string' ? dateInput.split('T')[0] : '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
    // Fallback seguro usando métodos locales rellenando con ceros a la izquierda
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export function TransactionForm({ onSubmitSuccess, isLoading, transaction, onCancelEdit }: TransactionFormProps) {
  const isEditing = !!transaction; 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      description: '',
      category_id: null,
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Cargar datos en el formulario evitando desfases de zonas horarias al formatear
  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || '',
        category_id: transaction.category_id,
        date: getSafeDateString(transaction.date),
      });
    } else {
      reset({
        type: 'expense',
        amount: 0,
        description: '',
        category_id: null,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, reset]);

  const FormSubmit = (data: CreateTransactionInput) => {
    // Convertimos la fecha local seleccionada a un ISO String limpio para la BD
    const processedData = {
      ...data,
      date: new Date(data.date).toISOString()
    };
    
    onSubmitSuccess(processedData as any);
    if (!isEditing) {
      reset(); 
    }
  };

  return (
    <form onSubmit={handleSubmit(FormSubmit)} className="space-y-4 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
        {isEditing ? '✏️ Editar Movimiento' : 'Registrar Movimiento'}
      </h2>

      {/* Tipo de Transacción */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Tipo</label>
        <select
          {...register('type')}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          <option value="expense">Gasto 🔻</option>
          <option value="income">Ingreso 🔺</option>
        </select>
        {errors.type && <p className="text-red-500 text-xs mt-1 font-medium">{errors.type.message}</p>}
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Monto</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-colors"
          placeholder="0.00"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1 font-medium">{errors.amount.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Descripción</label>
        <input
          type="text"
          {...register('description')}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-colors"
          placeholder="Ej. Almuerzo, Salario, etc."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Fecha</label>
        <input
          type="date"
          {...register('date')}
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-colors"
        />
        {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date.message}</p>}
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col space-y-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 text-white font-bold rounded-xl shadow-sm transition duration-150 cursor-pointer ${
            isEditing 
              ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' 
              : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
          }`}
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Transacción' : 'Guardar Transacción'}
        </button>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white font-bold rounded-xl transition duration-150 cursor-pointer"
          >
            Cancelar Edición
          </button>
        )}
      </div>
    </form>
  );
}