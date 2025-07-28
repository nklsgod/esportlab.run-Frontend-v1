import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Users, User, Target, Plus, Trophy } from "lucide-react";

export const Tasks = () => {
  // Dummy Data
  const teamTasks = [
    { id: 1, title: "Scrim gegen Team Alpha", description: "Übungsmatches vorbereiten", completed: false, priority: "high", dueDate: "2024-01-20" },
    { id: 2, title: "Map Pool Review", description: "Aktuelle Meta-Maps analysieren", completed: true, priority: "medium", dueDate: "2024-01-18" },
    { id: 3, title: "Tournament Anmeldung", description: "Für nächstes Tournament registrieren", completed: false, priority: "high", dueDate: "2024-01-25" }
  ];

  const coachTasks = [
    { id: 4, title: "Strategie Meeting", description: "Neue Taktiken besprechen", completed: false, priority: "high", assignedBy: "Coach Mike" },
    { id: 5, title: "VOD Review Session", description: "Letzte Matches analysieren", completed: true, priority: "medium", assignedBy: "Coach Mike" },
    { id: 6, title: "Individual Training Plan", description: "Persönliche Verbesserungsplan", completed: false, priority: "low", assignedBy: "Coach Mike" }
  ];

  const roleTasks = {
    duelist: [
      { id: 7, title: "Entry Fragging Practice", description: "Aim Training und Positioning", completed: false, priority: "high" },
      { id: 8, title: "Aggressive Angles Study", description: "Map-spezifische Winkel lernen", completed: true, priority: "medium" }
    ],
    controller: [
      { id: 9, title: "Smoke Setups Review", description: "Optimale Smoke-Platzierungen", completed: false, priority: "high" },
      { id: 10, title: "Utility Usage Analysis", description: "Effiziente Ability-Nutzung", completed: false, priority: "medium" }
    ],
    sentinel: [
      { id: 11, title: "Defensive Positioning", description: "Optimale Verteidigungspositionen", completed: true, priority: "high" },
      { id: 12, title: "Flank Watch Timing", description: "Timing für Flank-Überwachung", completed: false, priority: "medium" }
    ],
    initiator: [
      { id: 13, title: "Info Gathering Drills", description: "Reconnaissance Techniken", completed: false, priority: "high" },
      { id: 14, title: "Team Entry Support", description: "Support für Entry-Spieler", completed: true, priority: "medium" }
    ],
    flex: [
      { id: 15, title: "Multi-Role Training", description: "Verschiedene Rollen üben", completed: false, priority: "high" },
      { id: 16, title: "Adaptability Drills", description: "Flexibilität im Spiel", completed: false, priority: "low" }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-roles-duelist text-roles-duelist';
      case 'medium': return 'border-roles-initiator text-roles-initiator';
      case 'low': return 'border-roles-controller text-roles-controller';
      default: return 'border-muted-foreground text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'duelist': 'border-roles-duelist text-roles-duelist',
      'controller': 'border-roles-controller text-roles-controller',
      'sentinel': 'border-roles-sentinel text-roles-sentinel',
      'initiator': 'border-roles-initiator text-roles-initiator',
      'flex': 'border-roles-flex text-roles-flex'
    };
    return colors[role as keyof typeof colors] || 'border-muted-foreground text-muted-foreground';
  };

  const TaskCard = ({ task, showAssignedBy = false }: { task: any, showAssignedBy?: boolean }) => (
    <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      <Checkbox 
        checked={task.completed} 
        className="mt-1"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h4>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{task.description}</p>
        {showAssignedBy && task.assignedBy && (
          <p className="text-xs text-muted-foreground">Von: {task.assignedBy}</p>
        )}
        {task.dueDate && (
          <p className="text-xs text-muted-foreground">Fällig: {task.dueDate}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Aufgaben
          </h1>
          <p className="text-muted-foreground">
            Team-, Coach- und rollenspezifische Aufgaben verwalten
          </p>
        </div>
        <Button variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Neue Aufgabe
        </Button>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-3 w-full lg:w-auto">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="coach">Coach</TabsTrigger>
          <TabsTrigger value="role">Rolle</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Aufgaben
              </CardTitle>
              <CardDescription>
                Aufgaben für das gesamte Team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coach" className="space-y-6">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Coach Aufgaben
              </CardTitle>
              <CardDescription>
                Vom Coach zugewiesene Aufgaben
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coachTasks.map((task) => (
                <TaskCard key={task.id} task={task} showAssignedBy />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(roleTasks).map(([role, tasks]) => (
              <Card key={role} className="bg-gradient-card border-primary/20 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className={`w-5 h-5 ${getRoleColor(role).split(' ')[1]}`} />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    Rollenspezifische Aufgaben
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};