import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Video,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RefreshCw,
  Download,
  ChevronRight
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroImage from "@/assets/hero-fitness.jpg";

const exerciseTypes = [
  "Agachamento Livre",
  "Supino Reto",
  "Levantamento Terra",
  "Desenvolvimento",
  "Remada Curvada",
];

const mockAnalysisResult = {
  exercise: "Agachamento Livre",
  overallScore: 78,
  status: "warning" as const,
  feedback: [
    { type: "success" as const, message: "Profundidade do agachamento adequada" },
    { type: "success" as const, message: "Posição dos pés correta" },
    { type: "warning" as const, message: "Joelhos projetando levemente para dentro" },
    { type: "error" as const, message: "Coluna lombar perdendo neutralidade na fase final" },
  ],
  recommendations: [
    "Foque em empurrar os joelhos para fora durante a subida",
    "Reduza a carga em 10% até corrigir a postura",
    "Pratique o movimento sem peso, focando na lombar",
    "Considere usar um cinto para cargas mais pesadas",
  ],
  riskLevel: "medium" as const,
  jointAngles: {
    joelho: 92,
    quadril: 88,
    tornozelo: 75,
  },
};

const Analysis = () => {
  const { user } = useAuth();
  const [analysisState, setAnalysisState] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de arquivo não suportado. Use MP4 ou MOV.");
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo 100MB.");
      return;
    }

    // Create local preview URL immediately
    const localUrl = URL.createObjectURL(file);
    setUploadedVideoUrl(localUrl);

    setAnalysisState("uploading");
    setUploadProgress(0);

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      if (user) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Upload with progress tracking
        const { error: uploadError } = await supabase.storage
          .from('exercise-videos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          // Don't throw, just continue with local file
          toast.error("Erro ao salvar na nuvem, usando arquivo local.");
        } else {
          // Get signed URL for the video if upload succeeded
          const { data: urlData } = await supabase.storage
            .from('exercise-videos')
            .createSignedUrl(fileName, 3600);

          if (urlData?.signedUrl) {
            setUploadedVideoUrl(urlData.signedUrl);
          }
        }
      } else {
        // If no user, just wait a bit to simulate upload time
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Vídeo processado com sucesso!");

      // Start analysis
      setAnalysisState("analyzing");

      // Simulate AI analysis (replace with real AI call when available)
      setTimeout(() => {
        setAnalysisState("complete");
      }, 2500);

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erro ao processar vídeo");
      setAnalysisState("idle");
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [user]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setAnalysisState("idle");
    setUploadProgress(0);
    setUploadedVideoUrl(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Análise de <span className="gradient-text">Movimento</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Faça upload do vídeo do seu exercício e receba feedback detalhado sobre sua execução.
            </p>
          </div>

          {analysisState === "idle" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Area */}
              <div className="glass-card p-8">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer group ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                    }`}
                  onClick={openFileDialog}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Upload de Vídeo</h3>
                  <p className="text-muted-foreground mb-6">
                    Arraste e solte seu vídeo aqui ou clique para selecionar
                  </p>
                  <Button variant="hero" type="button">
                    Selecionar Arquivo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Formatos aceitos: MP4, MOV • Máximo 100MB
                  </p>
                </div>
              </div>

              {/* Record Option */}
              <div className="glass-card p-8">
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group">
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Gravar Agora</h3>
                  <p className="text-muted-foreground mb-6">
                    Use sua câmera para gravar o exercício em tempo real
                  </p>
                  <Button variant="accent">
                    Abrir Câmera
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Certifique-se de ter boa iluminação e enquadramento
                  </p>
                </div>
              </div>
            </div>
          )}

          {(analysisState === "uploading" || analysisState === "analyzing") && (
            <div className="glass-card p-12 max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                {analysisState === "uploading" ? (
                  <Upload className="w-12 h-12 text-primary" />
                ) : (
                  <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                )}
              </div>

              <h3 className="font-display text-2xl font-semibold mb-4">
                {analysisState === "uploading" ? "Enviando Vídeo..." : "Analisando Movimento..."}
              </h3>

              <p className="text-muted-foreground mb-8">
                {analysisState === "uploading"
                  ? "Aguarde enquanto enviamos seu vídeo para análise."
                  : "Nossa IA está identificando pontos articulares e avaliando sua execução."}
              </p>

              <div className="max-w-md mx-auto">
                <Progress value={analysisState === "uploading" ? uploadProgress : 100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {analysisState === "uploading" ? `${uploadProgress}% concluído` : "Processando..."}
                </p>
              </div>
            </div>
          )}

          {analysisState === "complete" && (
            <div className="space-y-8">
              {/* Video Preview & Score */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    {uploadedVideoUrl ? (
                      <video
                        src={uploadedVideoUrl}
                        controls
                        className="w-full h-80 object-cover bg-black"
                      />
                    ) : (
                      <>
                        <img
                          src={heroImage}
                          alt="Exercise Analysis"
                          className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center hover:bg-primary transition-colors">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <span className="text-sm font-medium bg-card/80 px-3 py-1 rounded-full">
                        {mockAnalysisResult.exercise}
                      </span>
                      <Button variant="glass" size="sm">
                        <Download className="w-4 h-4" />
                        Baixar Relatório
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Score Card */}
                <div className="glass-card p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning to-success" />

                  <h3 className="font-display text-lg font-semibold mb-6">Pontuação Geral</h3>

                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="12"
                        strokeDasharray={`${(mockAnalysisResult.overallScore / 100) * 440} 440`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-4xl font-bold">{mockAnalysisResult.overallScore}%</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Parcialmente Correto</span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-secondary rounded-lg p-2">
                      <p className="text-muted-foreground">Joelho</p>
                      <p className="font-bold">{mockAnalysisResult.jointAngles.joelho}°</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-2">
                      <p className="text-muted-foreground">Quadril</p>
                      <p className="font-bold">{mockAnalysisResult.jointAngles.quadril}°</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-2">
                      <p className="text-muted-foreground">Tornozelo</p>
                      <p className="font-bold">{mockAnalysisResult.jointAngles.tornozelo}°</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback & Recommendations */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Feedback */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-semibold mb-6">Análise Detalhada</h3>
                  <div className="space-y-3">
                    {mockAnalysisResult.feedback.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg ${item.type === "success" ? "bg-success/10" :
                            item.type === "warning" ? "bg-warning/10" :
                              "bg-destructive/10"
                          }`}
                      >
                        {item.type === "success" ? (
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        ) : item.type === "warning" ? (
                          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`font-medium ${item.type === "success" ? "text-success" :
                            item.type === "warning" ? "text-warning" :
                              "text-destructive"
                          }`}>{item.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-semibold mb-6">Recomendações</h3>
                  <div className="space-y-4">
                    {mockAnalysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-muted-foreground pt-1">{rec}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span className="font-semibold text-warning">Nível de Risco: Médio</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Corrija os pontos indicados para evitar possíveis lesões na lombar e joelhos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" onClick={resetAnalysis}>
                  <RefreshCw className="w-5 h-5" />
                  Nova Análise
                </Button>
                <Button variant="glass" size="lg">
                  Ver no Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Supported Exercises */}
          {analysisState === "idle" && (
            <div className="mt-16">
              <h3 className="font-display text-xl font-semibold text-center mb-8">
                Exercícios Suportados
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {exerciseTypes.map((exercise) => (
                  <span
                    key={exercise}
                    className="px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {exercise}
                  </span>
                ))}
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  +45 outros
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analysis;
