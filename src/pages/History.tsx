import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  Video,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Analysis {
  id: string;
  video_url: string;
  exercise_type: string;
  overall_score: number;
  status: string;
  risk_level: string | null;
  created_at: string;
  feedback: unknown;
}

const History = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("exercise_analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, score: number) => {
    if (status === "pending") {
      return (
        <Badge variant="outline" className="bg-muted/50">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processando
        </Badge>
      );
    }

    if (score >= 80) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Excelente
        </Badge>
      );
    } else if (score >= 60) {
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Parcial
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="w-3 h-3 mr-1" />
          Atenção
        </Badge>
      );
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "low":
        return "Baixo";
      case "medium":
        return "Médio";
      case "high":
        return "Alto";
      default:
        return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Histórico de <span className="gradient-text">Análises</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Acompanhe sua evolução e reveja seus treinos anteriores.
              </p>
            </div>
            <Link to="/analysis">
              <Button variant="hero" size="lg">
                <Video className="w-5 h-5" />
                Nova Análise
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4">
                Nenhuma análise ainda
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Envie seu primeiro vídeo de exercício e receba feedback
                personalizado da nossa IA.
              </p>
              <Link to="/analysis">
                <Button variant="hero" size="lg">
                  Começar Agora
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {analyses.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total de Análises
                  </p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-success">
                    {analyses.filter((a) => a.overall_score >= 80).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Excelentes</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold text-warning">
                    {
                      analyses.filter(
                        (a) => a.overall_score >= 60 && a.overall_score < 80
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Parciais</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-3xl font-bold">
                    {analyses.length > 0
                      ? Math.round(
                          analyses.reduce((acc, a) => acc + a.overall_score, 0) /
                            analyses.length
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                </div>
              </div>

              {/* Analyses List */}
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="glass-card p-4 md:p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Video Thumbnail */}
                      <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <video
                          src={analysis.video_url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-display text-lg font-semibold">
                              {analysis.exercise_type}
                            </h3>
                            {getStatusBadge(
                              analysis.status,
                              analysis.overall_score
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(
                                new Date(analysis.created_at),
                                "dd MMM yyyy, HH:mm",
                                { locale: ptBR }
                              )}
                            </span>
                            {analysis.status === "complete" && (
                              <span
                                className={`flex items-center gap-1 ${getRiskColor(
                                  analysis.risk_level
                                )}`}
                              >
                                <AlertTriangle className="w-4 h-4" />
                                Risco: {getRiskLabel(analysis.risk_level)}
                              </span>
                            )}
                          </div>
                        </div>

                        {analysis.status === "complete" && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      analysis.overall_score >= 80
                                        ? "bg-success"
                                        : analysis.overall_score >= 60
                                        ? "bg-warning"
                                        : "bg-destructive"
                                    }`}
                                    style={{
                                      width: `${analysis.overall_score}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-bold">
                                  {analysis.overall_score}%
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {Array.isArray(analysis.feedback)
                                  ? (analysis.feedback as any[]).length
                                  : 0}{" "}
                                pontos analisados
                              </span>
                            </div>
                            <Button variant="ghost" size="sm">
                              Ver Detalhes
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
