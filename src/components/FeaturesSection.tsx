import { Activity, Dumbbell, TrendingUp, Video, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Análise de Vídeo em Tempo Real",
    description: "Faça upload dos seus vídeos de treino e receba feedback instantâneo sobre sua execução.",
  },
  {
    icon: Activity,
    title: "Rastreamento de Movimento",
    description: "IA avançada que identifica pontos articulares e analisa ângulos de movimento com precisão.",
  },
  {
    icon: Zap,
    title: "Feedback Instantâneo",
    description: "Receba correções em tempo real para aprimorar sua técnica e evitar lesões.",
  },
  {
    icon: TrendingUp,
    title: "Predição de Resultados",
    description: "Algoritmos inteligentes que estimam sua evolução e ajustam recomendações automaticamente.",
  },
  {
    icon: Dumbbell,
    title: "Treinos Personalizados",
    description: "Sugestões de volume, intensidade e frequência baseadas em seus objetivos.",
  },
  {
    icon: Shield,
    title: "Prevenção de Lesões",
    description: "Classificação de risco e alertas para movimentos que podem causar danos.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      
      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Tecnologia de Ponta para seu{" "}
            <span className="gradient-text">Treino</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combinamos visão computacional e inteligência artificial para revolucionar a forma como você treina.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 group hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
