import { useState, FormEvent } from 'react';
import { useCategories } from '../hooks/useCategories';

export function CategoryManager() {
  const [name, setName] = useState('');
  const {
    categoriesQuery,
    createCategoryMutation,
    deleteCategoryMutation,
  } = useCategories();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    createCategoryMutation.mutate(
      { name: trimmedName } as any,
      {
        onSuccess: () => setName(''),
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Categorías
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva categoría"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={createCategoryMutation.isPending || !name.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createCategoryMutation.isPending ? 'Agregando...' : 'Agregar'}
        </button>
      </form>

      {categoriesQuery.isLoading && (
        <p className="text-sm text-gray-500">Cargando categorías...</p>
      )}

      {categoriesQuery.isError && (
        <p className="text-sm text-red-600">
          Error al cargar las categorías:{' '}
          {(categoriesQuery.error as Error).message}
        </p>
      )}

      {categoriesQuery.isSuccess && (
        <ul className="divide-y divide-gray-200">
          {categoriesQuery.data.length === 0 && (
            <li className="py-3 text-sm text-gray-400">
              No hay categorías registradas.
            </li>
          )}

          {categoriesQuery.data.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between py-3"
            >
              <span className="text-sm text-gray-700">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deleteCategoryMutation.isPending}
                className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}