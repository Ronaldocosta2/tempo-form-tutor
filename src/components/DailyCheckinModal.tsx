import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sun,
  Moon,
  Zap,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Smile,
  Meh,
  Frown,
  Flame,
  Heart,
  Share2,
  Twitter,
  Instagram,
  Copy,
  Check,
  Sparkles,
  Trophy,
  Target,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface DailyCheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckinComplete?: () => void;
}

const moodOptions = [
  { value: "amazing", emoji: "🔥", label: "Incrível", icon: Flame, color: "text-orange-500" },
  { value: "good", emoji: "😊", label: "Bem", icon: Smile, color: "text-success" },
  { value: "okay", emoji: "😐", label: "Normal", icon: Meh, color: "text-warning" },
  { value: "tired", emoji: "😴", label: "Cansado", icon: Moon, color: "text-blue-400" },
  { value: "low", emoji: "😔", label: "Desanimado", icon: Frown, color: "text-muted-foreground" },
];

const energyLevels = [
  { value: 1, icon: BatteryLow, label: "Muito baixa", color: "text-destructive" },
  { value: 2, icon: BatteryLow, label: "Baixa", color: "text-orange-500" },
  { value: 3, icon: BatteryMedium, label: "Média", color: "text-warning" },
  { value: 4, icon: BatteryMedium, label: "Alta", color: "text-success" },
  { value: 5, icon: BatteryFull, label: "Máxima", color: "text-primary" },
];

export const DailyCheckinModal = ({
  open,
  onOpenChange,
  onCheckinComplete,
}: DailyCheckinModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [streak, setStreak] = useState(1);

  // Form state
  const [mood, setMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [muscleSoreness, setMuscleSoreness] = useState(0);
  const [weight, setWeight] = useState("");
  const [goals, setGoals] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && user) {
      calculateStreak();
    }
  }, [open, user]);

  const calculateStreak = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("daily_checkins")
      .select("checkin_date, streak_count")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastCheckin = new Date(data[0].checkin_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastCheckin.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreak(data[0].streak_count + 1);
      } else if (diffDays === 0) {
        setStreak(data[0].streak_count);
      } else {
        setStreak(1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    if (!mood || energyLevel === 0) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const xpEarned = 50 + (sleepQuality > 0 ? 10 : 0) + (goals ? 20 : 0) + (weight ? 10 : 0);

      const { error } = await supabase.from("daily_checkins").insert({
        user_id: user.id,
        mood,
        energy_level: energyLevel,
        sleep_quality: sleepQuality || null,
        muscle_soreness: muscleSoreness || null,
        goals_for_today: goals || null,
        notes: notes || null,
        weight_kg: weight ? parseFloat(weight) : null,
        streak_count: streak,
        xp_earned: xpEarned,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Você já fez o check-in hoje!");
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Check-in realizado! +${xpEarned} XP 🎉`);
      setStep(3); // Go to share step
      onCheckinComplete?.();
    } catch (error: any) {
      console.error("Checkin error:", error);
      toast.error("Erro ao salvar check-in");
    } finally {
      setLoading(false);
    }
  };

  const generateShareText = () => {
    const moodEmoji = moodOptions.find((m) => m.value === mood)?.emoji || "💪";
    return `${moodEmoji} Check-in diário feito!\n\n🔥 Streak: ${streak} dias\n⚡ Energia: ${"⚡".repeat(energyLevel)}\n${goals ? `🎯 Meta: ${goals}\n` : ""}\n#FitnessJourney #CheckIn #TempoFormTutor`;
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();

    if (platform === "copy") {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copiado para a área de transferência!");

      // Mark as shared
      if (user) {
        await supabase
          .from("daily_checkins")
          .update({ shared_to_social: true })
          .eq("user_id", user.id)
          .eq("checkin_date", new Date().toISOString().split("T")[0]);
      }
      return;
    }

    const encodedText = encodeURIComponent(text);
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodedText}`;
        break;
    }

    if (url) {
      window.open(url, "_blank");

      // Mark as shared
      if (user) {
        await supabase
          .from("daily_checkins")
          .update({ shared_to_social: true })
          .eq("user_id", user.id)
          .eq("checkin_date", new Date().toISOString().split("T")[0]);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setMood("");
      setEnergyLevel(0);
      setSleepQuality(0);
      setMuscleSoreness(0);
      setWeight("");
      setGoals("");
      setNotes("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                {step === 3 ? (
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Sun className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {step === 3 ? "Check-in Completo! 🎉" : "Check-in Diário"}
                </DialogTitle>
                <DialogDescription>
                  {step === 3
                    ? "Compartilhe seu progresso e inspire outros!"
                    : `Dia ${streak} de streak - Continue assim! 🔥`}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            {/* Mood Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Como você está se sentindo hoje? *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMood(option.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      mood === option.value
                        ? "bg-primary/20 border-2 border-primary scale-105"
                        : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Nível de energia *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {energyLevels.map((level) => {
                  const Icon = level.icon;
                  return (
                    <button
                      key={level.value}
                      onClick={() => setEnergyLevel(level.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        energyLevel === level.value
                          ? "bg-primary/20 border-2 border-primary scale-105"
                          : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${level.color}`} />
                      <span className="text-xs">{level.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Qualidade do sono (opcional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSleepQuality(value)}
                    className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg transition-all ${
                      sleepQuality === value
                        ? "bg-blue-500/20 border-2 border-blue-500"
                        : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                    }`}
                  >
                    <Moon className={`w-4 h-4 ${sleepQuality >= value ? "text-blue-400" : "text-muted-foreground"}`} />
                    <span className="text-sm">{value}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!mood || energyLevel === 0}
            >
              Continuar
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            {/* Muscle Soreness */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Dor muscular (1 = nenhuma, 5 = muita)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMuscleSoreness(value)}
                    className={`flex-1 p-3 rounded-lg transition-all ${
                      muscleSoreness === value
                        ? "bg-orange-500/20 border-2 border-orange-500"
                        : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-lg font-bold">{value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Peso de hoje (kg) - opcional
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 75.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            {/* Goals */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Meta para hoje (+20 XP)
              </label>
              <Input
                placeholder="Ex: Fazer 30 min de cardio"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Observações
              </label>
              <Textarea
                placeholder="Como foi seu treino ontem? Algo a melhorar?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Salvando..." : "Fazer Check-in"}
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-4">
            {/* Success Card */}
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Flame className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-3xl font-bold mb-2">
                🔥 {streak} Dias de Streak!
              </h3>
              <p className="text-muted-foreground mb-4">
                Você está construindo um hábito poderoso. Continue assim!
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-background/50 rounded-lg px-4 py-2">
                  <p className="text-2xl font-bold text-primary">+{50 + (sleepQuality > 0 ? 10 : 0) + (goals ? 20 : 0) + (weight ? 10 : 0)}</p>
                  <p className="text-xs text-muted-foreground">XP ganho</p>
                </div>
                <div className="bg-background/50 rounded-lg px-4 py-2">
                  <p className="text-2xl font-bold text-warning">
                    {moodOptions.find((m) => m.value === mood)?.emoji}
                  </p>
                  <p className="text-xs text-muted-foreground">Humor</p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Compartilhe seu progresso!
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Inspire amigos e ganhe +25 XP bônus ao compartilhar!
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={() => handleShare("twitter")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare("whatsapp")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare("copy")}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  <span className="text-xs">{copied ? "Copiado!" : "Copiar"}</span>
                </Button>
              </div>

              {/* Preview */}
              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <p className="whitespace-pre-line text-muted-foreground">
                  {generateShareText()}
                </p>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleClose}>
              Concluir
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
