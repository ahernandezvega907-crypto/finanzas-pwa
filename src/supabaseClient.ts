/// <reference types="vite/client" />

import { createClient } from "@supabase/supabase-js";

console.log("========== ENV ==========");
console.log(import.meta.env);
console.log("URL =", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY =", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("=========================");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL no existe");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY no existe");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);