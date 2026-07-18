import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { Transaction } from "../../../types/transaction";

export function exportPdf(transactions: Transaction[], categoriesMap: Record<string, string>): void {
  if (transactions.length === 0) return;

  const doc = new jsPDF() as any;

  // Título del documento
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Color esmeralda de MoneyFlow
  doc.text("MoneyFlow - Reporte de Transacciones", 14, 20);

  // Fecha de generación
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 14, 27);

  // Formatear filas para la tabla
  const tableRows = transactions.map((t) => {
    const categoryId = t.category_id ?? "";
    return [
      t.date,
      t.description || "", // Usamos description
      categoriesMap[categoryId] || "Sin Categoría",
      t.type === "income" ? "Ingreso" : "Gasto",
      `$${t.amount.toFixed(2)}`
    ];
  });

  // Generar tabla auto-formateada
  doc.autoTable({
    startY: 32,
    head: [["Fecha", "Concepto", "Categoría", "Tipo", "Monto"]],
    body: tableRows,
    headStyles: { fillColor: [16, 185, 129] }, // Cabecera verde esmeralda
    alternateRowStyles: { fillColor: [248, 250, 252] }, // Filas alternadas suaves
    margin: { top: 30 },
  });

  // Guardar PDF
  doc.save(`MoneyFlow_Reporte_${new Date().toISOString().split("T")[0]}.pdf`);
}