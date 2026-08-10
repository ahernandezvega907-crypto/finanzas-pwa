export type Result<T, E = { message: string; code?: string }> =
  | { success: true; data: T }
  | { success: false; error: E };