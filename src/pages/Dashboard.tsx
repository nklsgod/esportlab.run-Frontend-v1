import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ScheduleOverview } from '@/components/ScheduleOverview';
import { apiClient } from '@/lib/api';
import type { Team, User } from '@/types/api';
import { Users, Plus, Copy, LogOut, Settings, Calendar, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [userResponse, teamsResponse] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getTeams()
      ]);
      
      setUser(userResponse.user);
      setTeams(teamsResponse.teams);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      const response = await apiClient.createTeam(newTeamName);
      setTeams([...teams, response.team]);
      setNewTeamName('');
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: `Team "${response.team.name}" created successfully!`,
      });
    } catch (error) {
      console.error('Failed to create team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const response = await apiClient.joinTeam(joinCode);
      setTeams([...teams, response.team]);
      setJoinCode('');
      setShowJoinForm(false);
      toast({
        title: "Success",
        description: `Successfully joined team "${response.team.name}"!`,
      });
    } catch (error) {
      console.error('Failed to join team:', error);
      toast({
        title: "Error",
        description: "Failed to join team. Please check the join code.",
        variant: "destructive",
      });
    }
  };

  const handleCopyJoinCode = async (joinCode: string) => {
    try {
      await navigator.clipboard.writeText(joinCode);
      toast({
        title: "Copied",
        description: "Join code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy join code",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    apiClient.clearTokens();
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  esportLab.run
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatarUrl || '/placeholder.svg'}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="teams" className="w-full">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex-auto">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="teams" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Teams
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Schedule
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                <Button
                  onClick={() => setShowJoinForm(true)}
                  variant="outline"
                >
                  Join Team
                </Button>
                <Button
                  onClick={() => setShowCreateForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </div>

            <TabsContent value="teams" className="mt-8 space-y-8">
              {/* Create Team Form */}
              {showCreateForm && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Create New Team</CardTitle>
                <CardDescription>
                  Create a new team and invite your teammates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeam} className="space-y-6">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Team
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Join Team Form */}
          {showJoinForm && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Join Existing Team</CardTitle>
                <CardDescription>
                  Enter a join code to join an existing team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinTeam} className="space-y-6">
                  <div>
                    <Label htmlFor="joinCode">Join Code</Label>
                    <Input
                      id="joinCode"
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter join code"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowJoinForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Join Team
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Teams List */}
          <div className="mt-8">
            {teams.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No teams yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first team or joining an existing one
                  </p>
                  <div className="mt-6 space-x-3">
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                    <Button variant="outline" onClick={() => setShowJoinForm(true)}>
                      Join Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <Badge variant="secondary">
                          {team.ownerId === user?.id ? 'Owner' : 'Member'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Created {new Date(team.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Join Code:</span>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {team.joinCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyJoinCode(team.joinCode);
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teams/${team.id}/schedule`);
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teams/${team.id}/settings`);
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-8">
              <ScheduleOverview teams={teams} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export { DashboardPage as Dashboard };
export default DashboardPage;