import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Flame, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DailyCheckinModal } from "./DailyCheckinModal";

export const DailyCheckinBanner = () => {
  const { user } = useAuth();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkTodayCheckin();
    }
  }, [user]);

  const checkTodayCheckin = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("checkin_date", today)
        .single();

      if (data && !error) {
        setHasCheckedIn(true);
        setStreak(data.streak_count);
      } else {
        // Get last streak
        const { data: lastCheckin } = await supabase
          .from("daily_checkins")
          .select("streak_count, checkin_date")
          .eq("user_id", user.id)
          .order("checkin_date", { ascending: false })
          .limit(1)
          .single();

        if (lastCheckin) {
          const lastDate = new Date(lastCheckin.checkin_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          lastDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            setStreak(lastCheckin.streak_count);
          } else if (diffDays > 1) {
            setStreak(0);
          }
        }
      }
    } catch (error) {
      console.error("Error checking checkin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinComplete = () => {
    checkTodayCheckin();
  };

  if (loading) return null;

  if (hasCheckedIn) {
    return (
      <div className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-2xl p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-semibold text-success">Check-in de hoje ✓</p>
              <p className="text-sm text-muted-foreground">
                Você está mantendo o foco! Continue assim.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-warning/20 rounded-full px-4 py-2">
            <Flame className="w-5 h-5 text-warning" />
            <span className="font-bold text-warning">{streak} dias</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-warning/10 border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-[40px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
              <Sun className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold mb-1">
                Bom dia! ☀️ Faça seu check-in
              </h3>
              <p className="text-muted-foreground">
                {streak > 0 
                  ? `Você está com ${streak} dias de streak! Não perca o ritmo.`
                  : "Comece uma nova sequência de check-ins e ganhe XP!"}
              </p>
            </div>
          </div>
          
          <Button variant="hero" size="lg" onClick={() => setModalOpen(true)}>
            Fazer Check-in
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <DailyCheckinModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCheckinComplete={handleCheckinComplete}
      />
    </>
  );
};
