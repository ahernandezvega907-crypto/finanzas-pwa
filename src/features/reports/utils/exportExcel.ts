import * as XLSX from "xlsx";
import type { Transaction } from "../../../types/transaction";

export function exportExcel(transactions: Transaction[], categoriesMap: Record<string, string>): void {
  if (transactions.length === 0) return;

  // Darle formato a los datos para que se muestren limpios en el Excel
  const formattedData = transactions.map((t) => {
    const categoryId = t.category_id ?? "";
    return {
      Fecha: t.date,
      Concepto: t.description || "", // Usamos description
      Categoría: categoriesMap[categoryId] || "Sin Categoría",
      Tipo: t.type === "income" ? "Ingreso" : "Gasto",
      Monto: t.amount,
    };
  });

  // Crear libro de trabajo (workbook) y hoja (worksheet)
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");

  // Ajustar anchos de columnas automáticamente
  const maxProps = [{ wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 12 }];
  worksheet["!cols"] = maxProps;

  // Guardar y descargar el archivo XLSX
  XLSX.writeFile(workbook, `MoneyFlow_Reporte_${new Date().toISOString().split("T")[0]}.xlsx`);
}