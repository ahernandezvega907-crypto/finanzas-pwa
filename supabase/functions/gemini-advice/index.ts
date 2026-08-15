import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DAILY_AI_LIMIT = 5;

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
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // --- Verificación de sesión real ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autenticado." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Sesión inválida." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const { userPrompt, context } = body || {};

    if (!userPrompt || typeof userPrompt !== "string") {
      return new Response(
        JSON.stringify({ error: "userPrompt es requerido." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- Rate limiting: 5 consultas/día por usuario ---
    const { data: usageData, error: usageError } = await supabase
      .rpc("check_and_increment_ai_usage", { p_limit: DAILY_AI_LIMIT })
      .single();

    if (usageError) {
      console.error("Error verificando cuota de IA:", usageError);
      return new Response(
        JSON.stringify({ error: "No pudimos verificar tu cuota diaria." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { allowed, current_count } = usageData as {
      allowed: boolean;
      current_count: number;
    };

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: `Alcanzaste tu límite de ${DAILY_AI_LIMIT} consultas gratuitas al Gurú IA por hoy. Vuelve mañana. 🙌`,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- API key de Groq (solo en el servidor) ---
    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    if (!groqApiKey) {
      console.error(
        "ERROR: GROQ_API_KEY no está configurada en Supabase Secrets."
      );
      return new Response(
        JSON.stringify({
          error: "Configuración de IA incompleta en el servidor.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- Contexto financiero (incluye categoría de mayor gasto) ---
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

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
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
      console.error(`Groq API HTTP ${groqResponse.status}:`, errText);

      return new Response(
        JSON.stringify({
          error: "El servicio de IA no pudo procesar la solicitud.",
          code: "AI_API_ERROR",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const groqData = await groqResponse.json();
    const text =
      groqData?.choices?.[0]?.message?.content ??
      "No se obtuvo una respuesta del Gurú IA.";

    return new Response(
      JSON.stringify({ text, usageCount: current_count, limit: DAILY_AI_LIMIT }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error no controlado en Edge Function:", error);
    return new Response(
      JSON.stringify({
        error: "Error inesperado al procesar tu solicitud.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});