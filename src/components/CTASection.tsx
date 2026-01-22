import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto relative z-10">
        <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden border-primary/20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm font-medium text-accent uppercase tracking-wider">Acesso Antecipado</span>
              </div>

              <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Comece Sua <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent">
                  Transformação
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Não treine sozinho. Tenha a inteligência de uma equipe olímpica no seu bolso.
                Junte-se a milhares de atletas que já estão no futuro.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button variant="accent" size="xl" className="group relative overflow-hidden" asChild>
                  <Link to="/auth">
                    <span className="relative z-10 flex items-center gap-2">
                      Iniciar Agora
                      <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button variant="glass" size="xl" className="border-white/10 hover:bg-white/5" asChild>
                  <Link to="/dashboard">
                    Ver Planos
                  </Link>
                </Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative perspective-1000">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
                <img
                  src={dashboardImage}
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-10 -right-10 glass-card p-6 animate-float border-primary/30 bg-black/50 backdrop-blur-xl">
                <div className="text-3xl font-bold text-success font-display">+15%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Força</div>
              </div>

              <div className="absolute -bottom-10 -left-10 glass-card p-6 animate-float border-accent/30 bg-black/50 backdrop-blur-xl" style={{ animationDelay: "1.5s" }}>
                <div className="text-3xl font-bold text-primary font-display">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Foco</div>
              </div>
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
