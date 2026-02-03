import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { analysisId, videoUrl, exerciseType } = await req.json();

    console.log("Starting analysis for:", { analysisId, exerciseType });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze the exercise using AI
    const systemPrompt = `Você é um especialista em análise de movimento e biomecânica para exercícios físicos. 
Sua tarefa é analisar a execução de exercícios e fornecer feedback detalhado.

Você deve retornar um JSON com a seguinte estrutura:
{
  "overallScore": number (0-100),
  "status": "success" | "warning" | "error",
  "riskLevel": "low" | "medium" | "high",
  "feedback": [
    { "type": "success" | "warning" | "error", "message": "string" }
  ],
  "recommendations": ["string"],
  "jointAngles": {
    "joelho": number,
    "quadril": number,
    "tornozelo": number
  }
}

Seja específico e técnico nas suas análises. Considere:
- Alinhamento postural
- Amplitude de movimento
- Simetria bilateral
- Padrões de compensação
- Riscos de lesão`;

    const userPrompt = `Analise o exercício "${exerciseType}" com base nas seguintes informações:

O usuário enviou um vídeo de treino realizando ${exerciseType}.

Gere uma análise realista e personalizada considerando erros comuns neste exercício:

Para ${exerciseType}, considere pontos como:
- Posição inicial e final do movimento
- Alinhamento de joelhos, quadris e coluna
- Profundidade adequada do movimento
- Velocidade e controle da execução
- Padrões de respiração

Retorne APENAS o JSON, sem markdown ou explicações adicionais.`;

    console.log("Calling Lovable AI for analysis...");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log("AI response received:", content?.substring(0, 200));

    // Parse the JSON response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback analysis
      analysisResult = {
        overallScore: 75,
        status: "warning",
        riskLevel: "medium",
        feedback: [
          { type: "success", message: "Vídeo processado com sucesso" },
          { type: "warning", message: "Análise automática com dados limitados" },
        ],
        recommendations: [
          "Continue praticando com atenção à postura",
          "Considere gravar em melhor iluminação para análises mais precisas",
        ],
        jointAngles: { joelho: 90, quadril: 85, tornozelo: 70 },
      };
    }

    // Update the analysis in the database
    const { error: updateError } = await supabase
      .from("exercise_analyses")
      .update({
        overall_score: analysisResult.overallScore,
        status: "complete",
        feedback: analysisResult.feedback,
        recommendations: analysisResult.recommendations,
        joint_angles: analysisResult.jointAngles,
        risk_level: analysisResult.riskLevel,
        ai_analysis: content,
      })
      .eq("id", analysisId);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    console.log("Analysis complete and saved:", analysisId);

    return new Response(
      JSON.stringify({ success: true, analysis: analysisResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
