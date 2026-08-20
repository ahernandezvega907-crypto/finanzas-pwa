import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // 1. Verificar JWT con el usuario real
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autenticado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Faltan variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY");
      return new Response(
        JSON.stringify({ error: "Configuración de servidor incompleta." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUser = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Sesión inválida o expirada." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Leer body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Cuerpo de solicitud inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { userPrompt, context } = body || {};

    if (!userPrompt || typeof userPrompt !== "string") {
      return new Response(
        JSON.stringify({ error: "userPrompt es requerido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Consultar plan del usuario
    const { data: profile, error: profileError } = await supabaseUser
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error obteniendo perfil:", profileError.message);
    }

    const rawIsPremium = !!profile?.is_premium;
    const expiry = profile?.premium_expires_at;
    const isPremium = rawIsPremium && (!expiry || new Date(expiry) > new Date());

    // 4. Calcular límite diario
    const dailyLimit = isPremium ? 20 : 5;

    // 5. Rate limiting usando RPC
    const { data: usageData, error: usageError } = await supabaseUser
      .rpc("check_and_increment_ai_usage", { p_limit: dailyLimit })
      .single();

    if (usageError) {
      console.error("Error verificando cuota de IA:", usageError.message);
      return new Response(
        JSON.stringify({ error: "No pudimos verificar tu cuota diaria." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { allowed, current_count } = (usageData || {}) as {
      allowed: boolean;
      current_count: number;
    };

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: `Alcanzaste tu límite de ${dailyLimit} consultas gratuitas al Gurú IA por hoy.`,
          isLimitReached: true,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Obtener API key de Groq
    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    if (!groqApiKey) {
      console.error("GROQ_API_KEY no configurada en las variables de entorno de Supabase.");
      return new Response(
        JSON.stringify({ error: "Configuración de IA incompleta en el servidor." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Contexto financiero
    let financialContext = "";
    if (context) {
      financialContext = `
--- CONTEXTO FINANCIERO DEL USUARIO ---
Ingresos totales: ₡${Number(context.totalIncome || 0).toLocaleString("es-CR")}
Gastos totales: ₡${Number(context.totalExpenses || 0).toLocaleString("es-CR")}
Saldo del mes: ₡${Number(context.balance || 0).toLocaleString("es-CR")}
Categoría con mayor gasto: ${context.highestExpenseCat || "No disponible"}
Monto en esa categoría: ₡${Number(context.maxExpense || 0).toLocaleString("es-CR")}
`;
    }

    const systemPrompt = `Eres el Gurú Financiero IA de MoneyFlow.
Tu función es ayudar al usuario a comprender y mejorar sus finanzas personales.
Personalidad: Profesional, empática, clara, directa y motivadora.
No inventes información financiera que no esté disponible.
Si faltan datos, indícalo claramente.
${financialContext}
Responde en español con un tono breve, útil y práctico.`;

    // 8. Llamada a Groq API
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error(`Groq API Error Status ${groqResponse.status}:`, errText);

      return new Response(
        JSON.stringify({
          error: "El servicio de IA no pudo procesar la solicitud.",
          code: "AI_API_ERROR",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqData = await groqResponse.json();
    const text =
      groqData?.choices?.[0]?.message?.content ??
      "No se obtuvo una respuesta del Gurú IA.";

    return new Response(
      JSON.stringify({ text, usageCount: current_count, limit: dailyLimit }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error no controlado en Edge Function:", error);
    return new Response(
      JSON.stringify({
        error: "Error inesperado al procesar tu solicitud.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});