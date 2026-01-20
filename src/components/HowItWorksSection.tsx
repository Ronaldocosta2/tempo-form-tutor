import poseImage from "@/assets/pose-analysis.jpg";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const analysisSteps = [
  {
    step: "01",
    title: "Upload do Vídeo",
    description: "Faça upload do vídeo do seu exercício ou grave diretamente pelo app.",
  },
  {
    step: "02",
    title: "Análise Inteligente",
    description: "Nossa IA identifica automaticamente o exercício e rastreia seus movimentos.",
  },
  {
    step: "03",
    title: "Feedback Detalhado",
    description: "Receba avaliação da execução com dicas práticas de correção.",
  },
  {
    step: "04",
    title: "Evolua Sempre",
    description: "Acompanhe seu progresso e veja sua técnica melhorar ao longo do tempo.",
  },
];

const feedbackExamples = [
  { icon: CheckCircle, label: "Amplitude correta", status: "success" },
  { icon: AlertTriangle, label: "Joelhos precisam atenção", status: "warning" },
  { icon: XCircle, label: "Postura da coluna incorreta", status: "error" },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Como <span className="gradient-text">Funciona</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Em apenas 4 passos simples, transforme seus treinos com análise profissional de movimento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {analysisSteps.map((item, index) => (
              <div
                key={item.step}
                className="flex gap-6 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-display text-xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Demo */}
          <div className="relative">
            <div className="glass-card p-6 relative overflow-hidden">
              <img
                src={poseImage}
                alt="Pose Analysis"
                className="w-full h-80 object-cover rounded-xl mb-6"
              />
              
              {/* Feedback overlay */}
              <div className="space-y-3">
                {feedbackExamples.map((feedback, index) => (
                  <div
                    key={feedback.label}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      feedback.status === "success" ? "bg-success/10 text-success" :
                      feedback.status === "warning" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <feedback.icon className="w-5 h-5" />
                    <span className="font-medium">{feedback.label}</span>
                  </div>
                ))}
              </div>

              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
