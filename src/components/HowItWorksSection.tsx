import poseImage from "@/assets/pose-analysis.jpg";
import { CheckCircle, XCircle, AlertTriangle, Scan, PlayCircle, Trophy } from "lucide-react";

const analysisSteps = [
  {
    step: "01",
    icon: Scan,
    title: "Scan Corporal",
    description: "Aponte a câmera. Nossa IA cria um modelo biomecânico 3D do seu corpo em segundos.",
  },
  {
    step: "02",
    icon: PlayCircle,
    title: "Treino Guiado",
    description: "Siga o plano personalizado. Receba correções de voz e visuais em tempo real.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Evolução Constante",
    description: "O sistema aprende com você, ajustando cargas e repetições para maximizar ganhos.",
  },
];

const feedbackExamples = [
  { icon: CheckCircle, label: "Coluna Alinhada", status: "success" },
  { icon: AlertTriangle, label: "Ajustar Joelhos", status: "warning" },
  { icon: XCircle, label: "Reduzir Carga", status: "error" },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-secondary/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5 -z-10" />

      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Simples. <span className="text-primary">Poderoso.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complexidade da ciência esportiva traduzida em uma experiência fluida e intuitiva.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-10">
            {analysisSteps.map((item, index) => (
              <div
                key={item.step}
                className="flex gap-6 group relative"
              >
                {/* Connecting line */}
                {index !== analysisSteps.length - 1 && (
                  <div className="absolute left-7 top-16 bottom-0 w-px bg-border group-hover:bg-primary/50 transition-colors" />
                )}

                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 z-10">
                  <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Demo */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl rounded-full" />
            <div className="glass-card p-6 relative overflow-hidden border-primary/20">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live Analysis</span>
              </div>

              <img
                src={poseImage}
                alt="Pose Analysis"
                className="w-full h-80 object-cover rounded-xl mb-6 opacity-80"
              />

              {/* Feedback overlay */}
              <div className="space-y-3">
                {feedbackExamples.map((feedback, index) => (
                  <div
                    key={feedback.label}
                    className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-md border ${feedback.status === "success" ? "bg-success/10 border-success/20 text-success" :
                        feedback.status === "warning" ? "bg-warning/10 border-warning/20 text-warning" :
                          "bg-destructive/10 border-destructive/20 text-destructive"
                      }`}
                  >
                    <feedback.icon className="w-5 h-5" />
                    <span className="font-medium font-mono">{feedback.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
