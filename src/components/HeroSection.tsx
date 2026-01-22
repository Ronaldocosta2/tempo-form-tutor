import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Activity, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none animate-pulse-slow" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="AI Fitness Analysis"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary tracking-wide uppercase">AI Personal Trainer V2.0</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-8 animate-slide-up tracking-tight leading-tight">
            O Futuro do Seu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              Treino é Agora
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
            Transforme seu corpo com a precisão da Inteligência Artificial. 
            Análise biomecânica em tempo real e planos adaptativos que evoluem com você.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button variant="hero" size="xl" className="group relative overflow-hidden min-w-[200px]" asChild>
              <Link to="/auth">
                <span className="relative z-10 flex items-center gap-2">
                  Iniciar Protocolo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" className="min-w-[200px] border-primary/30 hover:bg-primary/10" asChild>
              <Link to="/analysis">
                <Play className="w-5 h-5 mr-2" />
                Ver Simulação
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/10 animate-fade-in backdrop-blur-sm bg-white/5 rounded-2xl p-8" style={{ animationDelay: "600ms" }}>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <div className="font-display text-4xl font-bold text-white mb-1">10x</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Mais Rápido</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <Activity className="w-8 h-8 text-accent mb-3" />
              <div className="font-display text-4xl font-bold text-white mb-1">99.8%</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Precisão Biomecânica</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
              <div className="font-display text-4xl font-bold text-white mb-1">Elite</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Performance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
