import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, Target, Zap, Shield } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-32 px-4 bg-gradient-hero overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/1d7a332f-de7d-48c5-8cce-2307fc4c05e7.png" 
              alt="esportLab Logo" 
              className="h-24 w-auto"
            />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              .run
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Die ultimative Plattform für professionelles esports Team-Management. 
            Organisiere dein Team, plane Trainingszeiten und erreiche neue Höhen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={onLogin}>
              Jetzt starten
            </Button>
            <Button variant="outline" size="lg">
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Warum esportLab.run?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entwickelt von Gamern für Gamer. Alle Tools, die du für professionelles Team-Management brauchst.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  Automatische Erstellung optimaler Trainingspläne basierend auf Spieler-Verfügbarkeiten
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-roles-duelist/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-roles-duelist" />
                </div>
                <CardTitle>Rollen-System</CardTitle>
                <CardDescription>
                  Spezifische Aufgaben für Duelist, Controller, Sentinel, Initiator und Flex-Rollen
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Einfache Team-Erstellung und Beitritt über Codes. Perfekt für Coaches und Spieler
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-roles-controller/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-roles-controller" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Verfolge Trainingsfortschritte und Team-Performance mit detaillierten Analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-roles-sentinel/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-roles-sentinel" />
                </div>
                <CardTitle>Sichere Plattform</CardTitle>
                <CardDescription>
                  Deine Daten sind sicher. Professionelle Sicherheitsstandards für alle Teams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card hover:shadow-neon transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-roles-initiator/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-roles-initiator" />
                </div>
                <CardTitle>Instant Sync</CardTitle>
                <CardDescription>
                  Echtzeit-Updates für alle Team-Mitglieder. Immer auf dem neuesten Stand
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für den nächsten Level?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Starte noch heute mit esportLab.run und bringe dein Team an die Spitze
          </p>
          <Button variant="hero" size="lg" onClick={onLogin}>
            Kostenlos anmelden
          </Button>
        </div>
      </section>
    </div>
  );
};