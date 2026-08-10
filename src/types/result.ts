/**
 * Monada Result para el manejo estructurado de errores en MoneyFlow.
 * Evita el uso de excepciones (`throw`) en el flujo regular del negocio.
 */
export type Result<T, E = { message: string; code?: string }> =
  | { success: true; data: T }
  | { success: false; error: E };