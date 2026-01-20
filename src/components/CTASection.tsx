import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Acompanhe sua Evolução</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Dashboard Completo para{" "}
                <span className="gradient-text-accent">Resultados Reais</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Visualize seu progresso, acompanhe medidas corporais, veja predições inteligentes 
                e receba recomendações personalizadas para atingir seus objetivos mais rápido.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/auth">
                    Criar Minha Conta
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/dashboard">
                    Saiba Mais
                  </Link>
                </Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src={dashboardImage}
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float">
                <div className="text-2xl font-bold text-success">+12%</div>
                <div className="text-sm text-muted-foreground">Ganho Muscular</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-float" style={{ animationDelay: "1s" }}>
                <div className="text-2xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Precisão Média</div>
              </div>
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
