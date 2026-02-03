import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Trophy,
  Zap,
  Star,
  Target,
  ChevronRight,
  Sparkles,
  Calendar,
  RefreshCw,
  Loader2,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  requirement?: string;
}

interface DailyTip {
  day: string;
  tip: string;
  focus: string;
}

interface WeeklyPlanData {
  gamification: {
    level: number;
    xpCurrent: number;
    xpToNextLevel: number;
    xpProgress: number;
    streak: number;
    badges: Badge[];
  };
  weeklyStats: {
    totalExercises: number;
    avgScore: number;
    excellentCount: number;
    highRiskCount: number;
    needsRecovery: boolean;
    isExcelling: boolean;
  };
  recommendation: {
    planType: "recovery" | "progression" | "maintenance";
    headline: string;
    subheadline: string;
    weeklyChallenge: {
      title: string;
      description: string;
      reward: string;
    };
    dailyTips: DailyTip[];
    motivationalQuote: string;
    nextMilestone: {
      name: string;
      description: string;
      progress: number;
    };
  };
  userName: string;
}

export const WeeklyPlanCard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<WeeklyPlanData | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (user) {
      fetchWeeklyPlan();
    }
  }, [user]);

  const fetchWeeklyPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("weekly-plan");

      if (error) {
        console.error("Error fetching weekly plan:", error);
        if (error.message?.includes("429")) {
          toast.error("Limite de requisições. Tente novamente em alguns minutos.");
        } else if (error.message?.includes("402")) {
          toast.error("Créditos insuficientes.");
        } else {
          toast.error("Erro ao carregar plano semanal.");
        }
        return;
      }

      if (data?.success) {
        setPlanData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "recovery":
        return "from-blue-500 to-cyan-400";
      case "progression":
        return "from-orange-500 to-red-500";
      default:
        return "from-primary to-accent";
    }
  };

  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case "recovery":
        return "🧘";
      case "progression":
        return "🚀";
      default:
        return "💪";
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Gerando seu plano personalizado...</p>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">Plano Semanal</h3>
        <p className="text-muted-foreground mb-4">
          Complete sua primeira análise para receber recomendações personalizadas.
        </p>
        <Button variant="hero" onClick={fetchWeeklyPlan}>
          <RefreshCw className="w-4 h-4" />
          Gerar Plano
        </Button>
      </div>
    );
  }

  const { gamification, weeklyStats, recommendation, userName } = planData;

  return (
    <div className="space-y-6">
      {/* Gamification Header */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getPlanTypeColor(recommendation.planType)} opacity-10`} />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Level & XP */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-primary-foreground">
                    {gamification.level}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
                  <Star className="w-4 h-4 text-warning-foreground fill-current" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Level {gamification.level}</h3>
                <div className="flex items-center gap-2">
                  <Progress value={gamification.xpProgress} className="w-24 h-2" />
                  <span className="text-xs text-muted-foreground">
                    {gamification.xpCurrent}/{gamification.xpToNextLevel} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-3 bg-accent/10 rounded-full px-4 py-2">
              <Flame className="w-6 h-6 text-accent" />
              <div>
                <span className="font-display text-2xl font-bold text-accent">
                  {gamification.streak}
                </span>
                <span className="text-sm text-muted-foreground ml-1">dias</span>
              </div>
            </div>

            {/* Refresh Button */}
            <Button variant="ghost" size="sm" onClick={fetchWeeklyPlan}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {gamification.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  badge.unlocked
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
                title={badge.requirement || badge.name}
              >
                {badge.unlocked ? (
                  <span>{badge.icon}</span>
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span className={!badge.unlocked ? "opacity-50" : ""}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Recommendation Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getPlanTypeColor(recommendation.planType)}`} />
        
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">{getPlanTypeIcon(recommendation.planType)}</div>
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">
              {recommendation.headline}
            </h2>
            <p className="text-muted-foreground">{recommendation.subheadline}</p>
          </div>
        </div>

        {/* Weekly Stats Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">{weeklyStats.totalExercises} treinos</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm">{weeklyStats.avgScore}% média</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
            <Trophy className="w-4 h-4 text-success" />
            <span className="text-sm">{weeklyStats.excellentCount} excelentes</span>
          </div>
        </div>

        {/* Weekly Challenge */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-warning" />
                <h4 className="font-semibold">{recommendation.weeklyChallenge.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {recommendation.weeklyChallenge.description}
              </p>
            </div>
            <div className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm font-medium">
              {recommendation.weeklyChallenge.reward}
            </div>
          </div>
        </div>

        {/* Daily Tips */}
        <div className="mb-6">
          <h4 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Plano Diário
          </h4>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {recommendation.dailyTips.map((tip, index) => (
              <button
                key={tip.day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedDay === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {tip.day}
              </button>
            ))}
          </div>

          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium">
                {recommendation.dailyTips[selectedDay].focus}
              </span>
            </div>
            <p className="text-foreground">
              {recommendation.dailyTips[selectedDay].tip}
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-secondary/30 rounded-xl p-4 mb-6 border-l-4 border-accent">
          <p className="italic text-muted-foreground">
            "{recommendation.motivationalQuote}"
          </p>
        </div>

        {/* Next Milestone */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Próxima Conquista</span>
            </div>
            <h4 className="font-semibold">{recommendation.nextMilestone.name}</h4>
            <p className="text-sm text-muted-foreground">
              {recommendation.nextMilestone.description}
            </p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeDasharray={`${(recommendation.nextMilestone.progress / 100) * 176} 176`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">
                {Math.round(recommendation.nextMilestone.progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
