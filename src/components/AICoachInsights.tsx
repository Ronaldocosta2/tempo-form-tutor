import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Brain, Battery, Moon, Activity, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export function AICoachInsights() {
    const [step, setStep] = useState<"checkin" | "results">("checkin");
    const [soreness, setSoreness] = useState([5]);
    const [energy, setEnergy] = useState([5]);
    const [sleep, setSleep] = useState([7]);

    const generateInsights = () => {
        // Simple logic to simulate AI analysis
        const score = (energy[0] + sleep[0] * 1.5 - soreness[0]) / 2.5; // Rough score 0-10

        let recommendation = "";
        let prediction = "";
        let recoveryAction = "";

        if (score > 7) {
            recommendation = "Aumentar intensidade";
            prediction = "Você está pronto para quebrar recordes esta semana. Prevemos um aumento de 2-5% nas cargas.";
            recoveryAction = "Mantenha a hidratação e considere adicionar uma sessão de cardio leve.";
        } else if (score > 4) {
            recommendation = "Manter carga";
            prediction = "Semana de consolidação. Foque na técnica perfeita para garantir a evolução constante.";
            recoveryAction = "Foque em alongamentos pós-treino e garanta 8h de sono.";
        } else {
            recommendation = "Deload / Recuperação";
            prediction = "Seu corpo pede descanso. Uma semana regenerativa agora evitará lesões e garantirá maior evolução no próximo ciclo.";
            recoveryAction = "Priorize sono, massagem ou liberação miofascial. Reduza o volume de treino em 40%.";
        }

        return { score, recommendation, prediction, recoveryAction };
    };

    const insights = generateInsights();

    return (
        <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-display text-xl font-semibold">Coach AI</h3>
                    <p className="text-sm text-muted-foreground">Inteligência de Recuperação & Evolução</p>
                </div>
            </div>

            {step === "checkin" ? (
                <div className="space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 font-medium">
                                <Activity className="w-4 h-4 text-warning" /> Nível de Dor Muscular
                            </label>
                            <span className="text-sm text-muted-foreground">{soreness[0]}/10</span>
                        </div>
                        <Slider value={soreness} onValueChange={setSoreness} max={10} step={1} className="py-2" />
                        <p className="text-xs text-muted-foreground">0 = Sem dor, 10 = Muita dor</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 font-medium">
                                <Battery className="w-4 h-4 text-success" /> Nível de Energia
                            </label>
                            <span className="text-sm text-muted-foreground">{energy[0]}/10</span>
                        </div>
                        <Slider value={energy} onValueChange={setEnergy} max={10} step={1} className="py-2" />
                        <p className="text-xs text-muted-foreground">0 = Exausto, 10 = Energizado</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 font-medium">
                                <Moon className="w-4 h-4 text-primary" /> Horas de Sono
                            </label>
                            <span className="text-sm text-muted-foreground">{sleep[0]}h</span>
                        </div>
                        <Slider value={sleep} onValueChange={setSleep} max={12} step={0.5} className="py-2" />
                    </div>

                    <Button onClick={() => setStep("results")} className="w-full" variant="hero">
                        Gerar Análise da Semana <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Recomendação da Semana</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${insights.score > 7 ? "bg-success/20 text-success" :
                                    insights.score > 4 ? "bg-warning/20 text-warning" :
                                        "bg-destructive/20 text-destructive"
                                }`}>
                                {insights.recommendation}
                            </span>
                        </div>
                        <p className="font-medium leading-relaxed">
                            {insights.prediction}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-accent" />
                            Plano de Recuperação
                        </h4>
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-accent/5 border border-accent/10">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                {insights.recoveryAction}
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => setStep("checkin")} variant="ghost" className="w-full">
                        Refazer Check-in
                    </Button>
                </div>
            )}
        </div>
    );
}
