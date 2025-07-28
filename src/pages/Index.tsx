import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "./Dashboard";
import { Team } from "./Team";
import { Tasks } from "./Tasks";
import { Profile } from "./Profile";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <LandingPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "team":
        return <Team />;
      case "tasks":
        return <Tasks />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
};

export default Index;
