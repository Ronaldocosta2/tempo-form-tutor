import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Save,
  Target,
  Ruler,
  Scale,
  Activity,
  Calendar,
  Camera
} from "lucide-react";
import { useState } from "react";

const objectives = [
  { id: "emagrecimento", label: "Emagrecimento", icon: "🔥" },
  { id: "hipertrofia", label: "Hipertrofia", icon: "💪" },
  { id: "definicao", label: "Definição", icon: "✨" },
  { id: "condicionamento", label: "Condicionamento", icon: "🏃" },
];

const experienceLevels = [
  { id: "iniciante", label: "Iniciante", description: "Menos de 1 ano" },
  { id: "intermediario", label: "Intermediário", description: "1 a 3 anos" },
  { id: "avancado", label: "Avançado", description: "Mais de 3 anos" },
];

const Profile = () => {
  const [selectedObjective, setSelectedObjective] = useState("hipertrofia");
  const [selectedLevel, setSelectedLevel] = useState("intermediario");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Seu <span className="gradient-text">Perfil</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Mantenha seus dados atualizados para predições mais precisas.
            </p>
          </div>

          {/* Profile Photo */}
          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
                  <User className="w-16 h-16 text-primary-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-secondary border-2 border-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold">João Silva</h2>
                <p className="text-muted-foreground">joao.silva@email.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Plano Pro
                  </span>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    15 dias de sequência
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold">Informações Pessoais</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="João Silva" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="joao.silva@email.com" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input id="birthdate" type="date" defaultValue="1990-05-15" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <select id="sex" className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Body Measurements */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold">Medidas Corporais</h3>
              <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Última atualização: Hoje
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> Altura (cm)
                </Label>
                <Input id="height" type="number" defaultValue="178" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Peso (kg)
                </Label>
                <Input id="weight" type="number" defaultValue="80" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chest">Peitoral (cm)</Label>
                <Input id="chest" type="number" defaultValue="105" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input id="waist" type="number" defaultValue="80" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hip">Quadril (cm)</Label>
                <Input id="hip" type="number" defaultValue="100" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arm">Braço (cm)</Label>
                <Input id="arm" type="number" defaultValue="37.5" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thigh">Coxa (cm)</Label>
                <Input id="thigh" type="number" defaultValue="58" className="input-dark" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyfat">Gordura Corp. (%)</Label>
                <Input id="bodyfat" type="number" defaultValue="18" className="input-dark" />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-secondary/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">IMC</p>
                <p className="text-xl font-bold">25.2</p>
                <p className="text-xs text-warning">Sobrepeso</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Ideal</p>
                <p className="text-xl font-bold">72-75kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Massa Magra Est.</p>
                <p className="text-xl font-bold">65.6kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meta Gordura</p>
                <p className="text-xl font-bold">12-15%</p>
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-display text-xl font-semibold">Objetivo Principal</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {objectives.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-center ${
                    selectedObjective === obj.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl mb-2 block">{obj.icon}</span>
                  <span className="font-semibold">{obj.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-display text-xl font-semibold">Nível de Experiência</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedLevel === level.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-semibold block mb-1">{level.label}</span>
                  <span className="text-sm text-muted-foreground">{level.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="hero" size="lg">
              <Save className="w-5 h-5" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
