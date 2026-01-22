import { Brain, Target, Zap, Shield, Smartphone, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Neural Avançada",
    description: "Algoritmos de visão computacional que analisam cada micro-movimento do seu corpo em tempo real.",
  },
  {
    icon: Target,
    title: "Correção de Postura",
    description: "Feedback instantâneo sobre sua forma para prevenir lesões e maximizar a hipertrofia.",
  },
  {
    icon: Zap,
    title: "Planos Adaptativos",
    description: "Treinos que evoluem automaticamente baseados na sua performance e recuperação diária.",
  },
  {
    icon: Shield,
    title: "Prevenção de Lesões",
    description: "Monitoramento constante de carga e técnica para manter você treinando com segurança.",
  },
  {
    icon: Smartphone,
    title: "App Companion",
    description: "Leve seu personal AI para qualquer lugar. Sincronização total com wearables.",
  },
  {
    icon: BarChart3,
    title: "Analytics Profundo",
    description: "Métricas detalhadas de evolução, força, volume e consistência.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Tecnologia de <span className="text-primary">Ponta</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Uma suíte completa de ferramentas de alta performance para transformar seu potencial em resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card/50 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
