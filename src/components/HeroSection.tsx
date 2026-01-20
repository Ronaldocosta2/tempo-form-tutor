import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="AI Fitness Analysis"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Powered by AI & Computer Vision</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Treine com{" "}
            <span className="gradient-text">Precisão</span>
            <br />
            Evolua com{" "}
            <span className="gradient-text-accent">Inteligência</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            Análise automática de exercícios com IA. Correção em tempo real. 
            Predições personalizadas para alcançar seus objetivos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button variant="hero" size="xl">
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              <Play className="w-5 h-5" />
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text">98%</div>
              <p className="text-muted-foreground mt-2">Precisão na Análise</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text">50+</div>
              <p className="text-muted-foreground mt-2">Exercícios Suportados</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text">10k+</div>
              <p className="text-muted-foreground mt-2">Atletas Ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
