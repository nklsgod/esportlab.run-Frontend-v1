import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Trophy, BarChart3, Save, Edit } from "lucide-react";

const Profile = () => {
  // Dummy Data
  const userProfile = {
    username: "MaxGaming",
    email: "max@example.com",
    realName: "Max Mustermann",
    role: "Duelist",
    rank: "Immortal 2",
    team: "Cyber Wolves",
    joinDate: "2024-01-01",
    bio: "Professioneller esports Spieler mit Fokus auf Entry Fragging und aggressive Spielweise."
  };

  const gameStats = {
    hoursPlayed: 1250,
    averageACS: 245,
    headhotPercentage: 28,
    kd: 1.35,
    winRate: 65,
    mapsPlayed: 342
  };

  const recentMatches = [
    { map: "Ascent", result: "Win", score: "13-9", acs: 267, rating: 1.42 },
    { map: "Bind", result: "Loss", score: "8-13", acs: 198, rating: 0.89 },
    { map: "Haven", result: "Win", score: "13-11", acs: 289, rating: 1.56 },
    { map: "Split", result: "Win", score: "13-7", acs: 312, rating: 1.78 }
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Profil
          </h1>
          <p className="text-muted-foreground">
            Verwalte deine persönlichen Informationen und Statistiken
          </p>
        </div>
        <Button variant="hero">
          <Save className="w-4 h-4 mr-2" />
          Speichern
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-3 w-full lg:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="stats">Statistiken</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Info */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Persönliche Informationen
                </CardTitle>
                <CardDescription>
                  Deine grundlegenden Profil-Informationen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Benutzername</Label>
                    <Input id="username" value={userProfile.username} />
                  </div>
                  <div>
                    <Label htmlFor="realName">Echter Name</Label>
                    <Input id="realName" value={userProfile.realName} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" value={userProfile.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Hauptrolle</Label>
                    <Select value={userProfile.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Duelist">Duelist</SelectItem>
                        <SelectItem value="Controller">Controller</SelectItem>
                        <SelectItem value="Sentinel">Sentinel</SelectItem>
                        <SelectItem value="Initiator">Initiator</SelectItem>
                        <SelectItem value="Flex">Flex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rank">Aktueller Rang</Label>
                    <Input id="rank" value={userProfile.rank} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Biografie</Label>
                  <Textarea id="bio" value={userProfile.bio} rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Team Informationen
                </CardTitle>
                <CardDescription>
                  Deine aktuelle Team-Zugehörigkeit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">{userProfile.team}</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant="outline" className={getRoleColor(userProfile.role)}>
                      {userProfile.role}
                    </Badge>
                    <Badge variant="secondary">{userProfile.rank}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Beigetreten: {new Date(userProfile.joinDate).toLocaleDateString('de-DE')}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{gameStats.hoursPlayed}</div>
                    <div className="text-sm text-muted-foreground">Stunden gespielt</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{gameStats.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Gewinnrate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Game Statistics */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Spiel-Statistiken
                </CardTitle>
                <CardDescription>
                  Deine Leistungsstatistiken
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{gameStats.averageACS}</div>
                    <div className="text-sm text-muted-foreground">Ø ACS</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-roles-duelist">{gameStats.headhotPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Headshot Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{gameStats.kd}</div>
                    <div className="text-sm text-muted-foreground">K/D Ratio</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-roles-sentinel">{gameStats.mapsPlayed}</div>
                    <div className="text-sm text-muted-foreground">Maps gespielt</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Letzte Matches
                </CardTitle>
                <CardDescription>
                  Deine letzten Spielergebnisse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{match.map}</div>
                      <div className="text-sm text-muted-foreground">{match.score}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={match.result === 'Win' ? 'default' : 'destructive'}>
                        {match.result}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        ACS: {match.acs} | Rating: {match.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Konto-Einstellungen
              </CardTitle>
              <CardDescription>
                Verwalte deine Konto-Einstellungen und Präferenzen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Passwort ändern</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Benachrichtigungen</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>E-Mail-Benachrichtigungen für Team-Updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>Benachrichtigungen für neue Aufgaben</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>Marketing-E-Mails</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="destructive">
                  Konto löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;