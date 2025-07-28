import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Crown, Copy, Settings, UserPlus, Calendar } from "lucide-react";
import { useState } from "react";

export const Team = () => {
  const [teamCode] = useState("ESLAB2024");
  
  // Dummy Data
  const teamInfo = {
    name: "Cyber Wolves",
    code: "ESLAB2024",
    owner: "MaxGaming",
    weeklyHours: 15,
    trainingDays: 4,
    created: "2024-01-01"
  };

  const teamMembers = [
    { id: 1, name: "MaxGaming", role: "Duelist", rank: "Immortal 2", status: "owner", online: true },
    { id: 2, name: "ShadowCtrl", role: "Controller", rank: "Immortal 1", status: "member", online: true },
    { id: 3, name: "WallMaster", role: "Sentinel", rank: "Diamond 3", status: "member", online: false },
    { id: 4, name: "FlashKing", role: "Initiator", rank: "Immortal 1", status: "member", online: true },
    { id: 5, name: "FlexAce", role: "Flex", rank: "Diamond 2", status: "member", online: false }
  ];

  const getRoleColor = (role: string) => {
    const colors = {
      'Duelist': 'text-roles-duelist border-roles-duelist',
      'Controller': 'text-roles-controller border-roles-controller',
      'Sentinel': 'text-roles-sentinel border-roles-sentinel',
      'Initiator': 'text-roles-initiator border-roles-initiator',
      'Flex': 'text-roles-flex border-roles-flex'
    };
    return colors[role as keyof typeof colors] || 'text-muted-foreground border-muted-foreground';
  };

  const copyTeamCode = () => {
    navigator.clipboard.writeText(teamCode);
    // In real app, show toast here
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Verwalte dein Team und lade neue Mitglieder ein
          </p>
        </div>
        <Button variant="hero">
          <Settings className="w-4 h-4 mr-2" />
          Team Einstellungen
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-3 w-full lg:w-auto">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="members">Mitglieder</TabsTrigger>
          <TabsTrigger value="invite">Einladen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team Info */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  {teamInfo.name}
                </CardTitle>
                <CardDescription>
                  Team Code: {teamInfo.code}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Owner</Label>
                    <div className="font-medium">{teamInfo.owner}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Mitglieder</Label>
                    <div className="font-medium">{teamMembers.length}/6</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Wöchentliche Stunden</Label>
                    <div className="font-medium">{teamInfo.weeklyHours}h</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Trainingstage</Label>
                    <div className="font-medium">{teamInfo.trainingDays}/Woche</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Schedule */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Trainingsplan
                </CardTitle>
                <CardDescription>
                  Optimierte Zeiten basierend auf Team-Verfügbarkeit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Montag</span>
                  <Badge variant="outline" className="border-primary text-primary">19:00-21:00</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Mittwoch</span>
                  <Badge variant="outline" className="border-primary text-primary">18:30-20:30</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Freitag</span>
                  <Badge variant="outline" className="border-primary text-primary">20:00-22:00</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Sonntag</span>
                  <Badge variant="outline" className="border-primary text-primary">16:00-18:00</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Mitglieder ({teamMembers.length}/6)
              </CardTitle>
              <CardDescription>
                Alle aktuellen Team-Mitglieder und ihre Rollen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${member.online ? 'bg-roles-sentinel' : 'bg-muted-foreground'}`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {member.status === 'owner' && (
                          <Crown className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.rank}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                    <Badge variant={member.online ? "default" : "secondary"}>
                      {member.online ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Team Code teilen
                </CardTitle>
                <CardDescription>
                  Teile diesen Code mit neuen Mitgliedern
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="teamCode">Team Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="teamCode"
                      value={teamCode} 
                      readOnly 
                      className="font-mono text-lg"
                    />
                    <Button variant="outline" onClick={copyTeamCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                  <h4 className="font-medium mb-2">Anweisungen für neue Mitglieder:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Bei esportLab.run registrieren</li>
                    <li>2. Auf "Team beitreten" klicken</li>
                    <li>3. Team Code eingeben: <code className="bg-muted px-2 py-1 rounded">{teamCode}</code></li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle>Team beitreten</CardTitle>
                <CardDescription>
                  Hast du einen Team Code erhalten?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="joinCode">Team Code eingeben</Label>
                  <Input 
                    id="joinCode"
                    placeholder="z.B. ESLAB2024"
                    className="font-mono"
                  />
                </div>
                <Button className="w-full" variant="hero">
                  Team beitreten
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};