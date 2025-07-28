import { Button } from "@/components/ui/button";
import { Users, Trophy, User, CheckSquare, BarChart3 } from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navigation = ({ isAuthenticated, onLogin, onLogout }: NavigationProps) => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-3 cursor-pointer">
              <img 
                src="/lovable-uploads/1d7a332f-de7d-48c5-8cce-2307fc4c05e7.png" 
                alt="esportLab Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                .run
              </span>
            </div>
            
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }))}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'team' }))}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </button>
                
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'tasks' }))}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Aufgaben</span>
                </button>
                
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={onLogout}>
                Abmelden
              </Button>
            ) : (
              <Button variant="hero" onClick={onLogin}>
                Anmelden
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};