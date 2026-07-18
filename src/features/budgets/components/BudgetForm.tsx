import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { budgetSchema } from "../../../validation/budget.schema";
import type { Budget } from "../../../types/budget";

// 1. Inferencia de tipos directa desde el esquema de Zod para evitar discrepancias
type BudgetFormInputs = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSubmitSuccess: (data: BudgetFormInputs) => Promise<void>;
  isLoading: boolean;
  categories: { id: string; name: string }[];
  selectedBudget: Budget | null;
  onCancelEdit: () => void;
}

export function BudgetForm({
  onSubmitSuccess,
  isLoading,
  categories,
  selectedBudget,
  onCancelEdit,
}: BudgetFormProps) {
  // 2. Vinculación estricta de useForm con el resolvedor de Zod
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: "",
      limit_amount: 0,
      period: "monthly",
    },
  });

  useEffect(() => {
    if (selectedBudget) {
      setValue("category_id", selectedBudget.category_id);
      setValue("limit_amount", selectedBudget.limit_amount);
      setValue("period", selectedBudget.period);
    } else {
      reset({
        category_id: "",
        limit_amount: 0,
        period: "monthly",
      });
    }
  }, [selectedBudget, setValue, reset]);

  const onSubmit = async (data: BudgetFormInputs) => {
    await onSubmitSuccess(data);
    if (!selectedBudget) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Categoría
        </label>
        <select
          {...register("category_id")}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Monto Límite
        </label>
        <input
          type="number"
          step="0.01"
          {...register("limit_amount", { valueAsNumber: true })}
          placeholder="0.00"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.limit_amount && (
          <p className="mt-1 text-xs text-red-500">{errors.limit_amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Período
        </label>
        <select
          {...register("period")}
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="monthly">Mensual</option>
          <option value="weekly">Semanal</option>
          <option value="yearly">Anual</option>
        </select>
        {errors.period && (
          <p className="mt-1 text-xs text-red-500">{errors.period.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 p-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {selectedBudget ? "Actualizar" : "Crear Presupuesto"}
        </button>
        {selectedBudget && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}