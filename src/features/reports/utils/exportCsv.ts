import type { Transaction } from "../../../types/transaction";

export function exportCsv(transactions: Transaction[], categoriesMap: Record<string, string>): void {
  if (transactions.length === 0) return;

  // Cabeceras del CSV
  const headers = ["Fecha", "Concepto", "Categoría", "Tipo", "Monto"];
  
  // Mapear transacciones a filas de texto estructurado
  const rows = transactions.map((t) => {
    // Controlamos de forma segura si category_id es nulo
    const categoryId = t.category_id ?? "";
    const categoryName = categoriesMap[categoryId] || "Sin Categoría";
    const typeLabel = t.type === "income" ? "Ingreso" : "Gasto";
    
    return [
      t.date,
      `"${(t.description || "").replace(/"/g, '""')}"`, // Usamos description de forma segura
      `"${categoryName.replace(/"/g, '""')}"`,
      typeLabel,
      t.amount.toString()
    ];
  });

  // Unir cabeceras y filas con salto de línea
  const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  
  // Crear el enlace de descarga temporal
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `MoneyFlow_Reporte_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}