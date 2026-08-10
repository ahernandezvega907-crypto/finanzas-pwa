import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "../schemas/transaction.schema";
import { Transaction } from "../domain/transaction.types";
import { useEffect } from "react";

interface UseTransactionFormProps {
  defaultValues?: Partial<TransactionFormData>;
  editingTransaction?: Transaction | null;
}

export function useTransactionForm({ defaultValues, editingTransaction }: UseTransactionFormProps = {}) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      categoryId: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  // Si entra en modo edición, resetea el formulario con los valores de la transacción seleccionada
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        categoryId: editingTransaction.categoryId,
        description: editingTransaction.description,
        date: editingTransaction.date.slice(0, 10),
      });
    }
  }, [editingTransaction, form]);

  return form;
}