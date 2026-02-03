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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    console.log("Generating weekly plan for user:", user.id);

    // Get analyses from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: weeklyAnalyses, error: analysesError } = await supabase
      .from("exercise_analyses")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (analysesError) {
      console.error("Error fetching analyses:", analysesError);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    // Calculate weekly stats
    const analyses = weeklyAnalyses || [];
    const totalExercises = analyses.length;
    const completedAnalyses = analyses.filter(a => a.status === "complete");
    const avgScore = completedAnalyses.length > 0
      ? Math.round(completedAnalyses.reduce((acc, a) => acc + a.overall_score, 0) / completedAnalyses.length)
      : 0;
    
    const highRiskCount = completedAnalyses.filter(a => a.risk_level === "high").length;
    const excellentCount = completedAnalyses.filter(a => a.overall_score >= 80).length;
    
    // Determine if user needs recovery or progression
    const needsRecovery = highRiskCount >= 2 || avgScore < 60;
    const isExcelling = excellentCount >= 3 && avgScore >= 80;

    // Generate gamification data
    const streak = Math.min(totalExercises, 7); // Simplified streak calculation
    const level = Math.floor(totalExercises / 5) + 1;
    const xpCurrent = (totalExercises % 5) * 100 + avgScore;
    const xpToNextLevel = 500;
    const xpProgress = Math.min((xpCurrent / xpToNextLevel) * 100, 100);

    // Calculate badges
    const badges = [];
    if (totalExercises >= 1) badges.push({ id: "first_analysis", name: "Primeiro Passo", icon: "🎯", unlocked: true });
    if (totalExercises >= 5) badges.push({ id: "dedicated", name: "Dedicado", icon: "💪", unlocked: true });
    if (excellentCount >= 1) badges.push({ id: "perfectionist", name: "Perfeccionista", icon: "⭐", unlocked: true });
    if (streak >= 3) badges.push({ id: "consistent", name: "Consistente", icon: "🔥", unlocked: true });
    if (streak >= 7) badges.push({ id: "unstoppable", name: "Imparável", icon: "🚀", unlocked: true });

    // Add locked badges for motivation
    if (totalExercises < 5) badges.push({ id: "dedicated", name: "Dedicado", icon: "💪", unlocked: false, requirement: "Complete 5 análises" });
    if (excellentCount < 1) badges.push({ id: "perfectionist", name: "Perfeccionista", icon: "⭐", unlocked: false, requirement: "Obtenha 80%+ em uma análise" });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate personalized AI recommendation
    const systemPrompt = `Você é um coach de fitness gamificado, motivacional e inspirador. 
Seu tom é energético, positivo e encorajador, como um personal trainer que realmente se importa com o sucesso do aluno.
Use emojis moderadamente para dar vida às mensagens.
Seja específico e prático nas recomendações.

Você deve retornar um JSON com a seguinte estrutura:
{
  "planType": "recovery" | "progression" | "maintenance",
  "headline": "string (frase motivacional curta e impactante)",
  "subheadline": "string (resumo do plano em uma frase)",
  "weeklyChallenge": {
    "title": "string",
    "description": "string",
    "reward": "string (ex: +100 XP)"
  },
  "dailyTips": [
    { "day": "Segunda", "tip": "string", "focus": "string" },
    { "day": "Terça", "tip": "string", "focus": "string" },
    { "day": "Quarta", "tip": "string", "focus": "string" },
    { "day": "Quinta", "tip": "string", "focus": "string" },
    { "day": "Sexta", "tip": "string", "focus": "string" }
  ],
  "motivationalQuote": "string",
  "nextMilestone": {
    "name": "string",
    "description": "string",
    "progress": number (0-100)
  }
}`;

    const userContext = `
Dados do usuário:
- Nome: ${profile?.full_name || "Atleta"}
- Objetivo: ${profile?.objective || "Condicionamento geral"}
- Nível: ${profile?.experience_level || "Intermediário"}
- Exercícios esta semana: ${totalExercises}
- Pontuação média: ${avgScore}%
- Análises excelentes (80%+): ${excellentCount}
- Análises com risco alto: ${highRiskCount}
- Streak atual: ${streak} dias
- Level atual: ${level}

${needsRecovery ? "O usuário precisa de um PLANO DE RECUPERAÇÃO porque teve muitas análises com risco alto ou pontuação baixa. Foque em recuperação ativa, correção de postura, e redução de intensidade." : ""}
${isExcelling ? "O usuário está EXCELENTE! Crie um PLANO DE PROGRESSÃO com desafios mais intensos e metas ambiciosas para manter a motivação alta." : ""}
${!needsRecovery && !isExcelling ? "O usuário está em um nível INTERMEDIÁRIO. Crie um plano balanceado focando em melhoria gradual e consistência." : ""}

Crie um plano personalizado e motivacional para a próxima semana.`;

    console.log("Calling Lovable AI for recommendation...");

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
            { role: "user", content: userContext },
          ],
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log("AI response received");

    let recommendation;
    try {
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recommendation = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback recommendation
      recommendation = {
        planType: needsRecovery ? "recovery" : isExcelling ? "progression" : "maintenance",
        headline: needsRecovery ? "Hora de Recarregar as Energias! 🔋" : isExcelling ? "Você Está em Chamas! 🔥" : "Continue no Ritmo! 💪",
        subheadline: needsRecovery 
          ? "Foque em recuperação ativa e técnica perfeita" 
          : isExcelling 
          ? "Hora de subir o nível e quebrar recordes"
          : "Mantenha a consistência e evolua gradualmente",
        weeklyChallenge: {
          title: "Desafio da Semana",
          description: needsRecovery 
            ? "Complete 3 análises com foco em postura perfeita"
            : "Aumente sua média de pontuação em 5%",
          reward: "+150 XP"
        },
        dailyTips: [
          { day: "Segunda", tip: "Aquecimento completo de 10 minutos", focus: "Mobilidade" },
          { day: "Terça", tip: "Foco na respiração durante os exercícios", focus: "Técnica" },
          { day: "Quarta", tip: "Dia de exercícios leves ou descanso ativo", focus: "Recuperação" },
          { day: "Quinta", tip: "Trabalhe os pontos fracos identificados", focus: "Correção" },
          { day: "Sexta", tip: "Teste seu progresso com uma análise completa", focus: "Avaliação" },
        ],
        motivationalQuote: "O único treino ruim é aquele que não acontece. Mas lembre-se: qualidade supera quantidade!",
        nextMilestone: {
          name: "Atleta Consistente",
          description: "Complete 10 análises com pontuação acima de 70%",
          progress: Math.min((completedAnalyses.filter(a => a.overall_score >= 70).length / 10) * 100, 100)
        }
      };
    }

    // Return complete gamification data
    const result = {
      success: true,
      gamification: {
        level,
        xpCurrent,
        xpToNextLevel,
        xpProgress,
        streak,
        badges,
      },
      weeklyStats: {
        totalExercises,
        avgScore,
        excellentCount,
        highRiskCount,
        needsRecovery,
        isExcelling,
      },
      recommendation,
      userName: profile?.full_name || "Atleta",
    };

    console.log("Weekly plan generated successfully");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Weekly plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
