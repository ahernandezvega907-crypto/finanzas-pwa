/**
 * Convierte una fecha local al formato YYYY-MM-DD.
 * Retorna una cadena vacía si la fecha no es válida, evitando problemas de zona horaria.
 */
export function toISODate(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}