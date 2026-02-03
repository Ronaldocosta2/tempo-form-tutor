import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Activity,
  Calendar,
  ChevronRight,
  Dumbbell
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { AICoachInsights } from "@/components/AICoachInsights";
import { WeeklyPlanCard } from "@/components/WeeklyPlanCard";
import { DailyCheckinBanner } from "@/components/DailyCheckinBanner";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const weightData = [
  { date: "Jan", peso: 85 },
  { date: "Fev", peso: 84 },
  { date: "Mar", peso: 83.5 },
  { date: "Abr", peso: 82 },
  { date: "Mai", peso: 81 },
  { date: "Jun", peso: 80 },
];

const performanceData = [
  { exercise: "Agachamento", accuracy: 92 },
  { exercise: "Supino", accuracy: 88 },
  { exercise: "Levantamento", accuracy: 78 },
  { exercise: "Desenvolvimento", accuracy: 85 },
  { exercise: "Remada", accuracy: 90 },
];

const measurementsData = [
  { month: "Jan", peito: 100, braco: 35, cintura: 85 },
  { month: "Fev", peito: 101, braco: 35.5, cintura: 84 },
  { month: "Mar", peito: 102, braco: 36, cintura: 83 },
  { month: "Abr", peito: 103, braco: 36.5, cintura: 82 },
  { month: "Mai", peito: 104, braco: 37, cintura: 81 },
  { month: "Jun", peito: 105, braco: 37.5, cintura: 80 },
];

const recentExercises = [
  { name: "Agachamento Livre", date: "Hoje", status: "correct", score: 95 },
  { name: "Supino Reto", date: "Hoje", status: "warning", score: 82 },
  { name: "Levantamento Terra", date: "Ontem", status: "correct", score: 88 },
  { name: "Desenvolvimento", date: "Ontem", status: "error", score: 65 },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto">
          {/* Daily Check-in Banner */}
          <DailyCheckinBanner />

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Olá, <span className="gradient-text">Atleta</span>! 👋
            </h1>
            <p className="text-muted-foreground">
              Aqui está o resumo do seu progresso e análises recentes.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display">87%</h3>
              <p className="text-muted-foreground">Precisão Média</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-5kg</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display">80kg</h3>
              <p className="text-muted-foreground">Peso Atual</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display">42</h3>
              <p className="text-muted-foreground">Exercícios Analisados</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
              </div>
              <h3 className="text-3xl font-bold font-display">15</h3>
              <p className="text-muted-foreground">Dias de Sequência</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Weight Evolution */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-semibold">Evolução do Peso</h3>
                <Button variant="ghost" size="sm">
                  Ver Mais <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
                    <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" />
                    <YAxis stroke="hsl(215, 20%, 55%)" domain={[75, 90]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 8%)",
                        border: "1px solid hsl(222, 47%, 16%)",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="peso"
                      stroke="hsl(160, 84%, 39%)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exercise Performance */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-semibold">Performance por Exercício</h3>
                <Button variant="ghost" size="sm">
                  Ver Mais <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
                    <XAxis type="number" stroke="hsl(215, 20%, 55%)" domain={[0, 100]} />
                    <YAxis dataKey="exercise" type="category" stroke="hsl(215, 20%, 55%)" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 8%)",
                        border: "1px solid hsl(222, 47%, 16%)",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar
                      dataKey="accuracy"
                      fill="hsl(160, 84%, 39%)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Body Measurements */}
            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-semibold">Medidas Corporais</h3>
                <Button variant="ghost" size="sm">
                  Ver Mais <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurementsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
                    <YAxis stroke="hsl(215, 20%, 55%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 8%)",
                        border: "1px solid hsl(222, 47%, 16%)",
                        borderRadius: "8px"
                      }}
                    />
                    <Line type="monotone" dataKey="peito" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ fill: "hsl(160, 84%, 39%)" }} />
                    <Line type="monotone" dataKey="braco" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={{ fill: "hsl(25, 95%, 53%)" }} />
                    <Line type="monotone" dataKey="cintura" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Peitoral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm text-muted-foreground">Braço</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Cintura</span>
                </div>
              </div>
            </div>

            {/* Recent Exercises */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-semibold">Análises Recentes</h3>
              </div>
              <div className="space-y-4">
                {recentExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${exercise.status === "correct" ? "bg-success/10" :
                      exercise.status === "warning" ? "bg-warning/10" :
                        "bg-destructive/10"
                      }`}>
                      <Dumbbell className={`w-5 h-5 ${exercise.status === "correct" ? "text-success" :
                        exercise.status === "warning" ? "text-warning" :
                          "text-destructive"
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${exercise.status === "correct" ? "text-success" :
                        exercise.status === "warning" ? "text-warning" :
                          "text-destructive"
                        }`}>{exercise.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/history">
                <Button variant="outline" className="w-full mt-4">
                  Ver Todas as Análises
                </Button>
              </Link>
            </div>
          </div>

          {/* Weekly Plan - Gamified Recommendations */}
          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold mb-6">
              Seu Plano <span className="gradient-text">Semanal</span>
            </h2>
            <WeeklyPlanCard />
          </div>

          {/* AI Coach & Prediction Row */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <AICoachInsights />

            {/* Static Prediction Card (kept as secondary info) */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold mb-4">
                  Meta de <span className="gradient-text">Longo Prazo</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Com base no seu histórico de treinos, peso e medidas, nossa IA estima que você
                  atingirá seu objetivo de <strong className="text-foreground">75kg</strong> em aproximadamente:
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-5xl font-bold gradient-text">8</span>
                  <span className="text-2xl text-muted-foreground">semanas</span>
                </div>
                <Progress value={62} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">62% do caminho concluído</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="glass-card p-3 text-center bg-background/50">
                    <h4 className="text-xs text-muted-foreground mb-1">Taxa Atual</h4>
                    <p className="text-lg font-bold text-success">-0.6kg/sem</p>
                  </div>
                  <div className="glass-card p-3 text-center bg-background/50">
                    <h4 className="text-xs text-muted-foreground mb-1">Tendência</h4>
                    <p className="text-lg font-bold text-success">Positiva ↑</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
