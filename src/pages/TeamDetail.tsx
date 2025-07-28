import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api';
import type { TeamDetail } from '@/types/api';
import { Users, Crown, Copy, Settings, Calendar, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Determine active tab from URL
    const path = location.pathname;
    if (path.includes('/schedule')) {
      setActiveTab('schedule');
    } else if (path.includes('/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadTeam = async () => {
      if (!id) return;
      
      try {
        const response = await apiClient.getTeam(id);
        setTeam(response.team);
      } catch (error) {
        console.error('Failed to load team:', error);
        toast({
          title: "Error",
          description: "Failed to load team details",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [id, navigate, toast]);

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

  const getRoleColor = (role: string | null) => {
    if (!role) return 'text-gray-500 border-gray-300';
    
    const colors: Record<string, string> = {
      'DUELLIST': 'text-red-600 border-red-300 bg-red-50',
      'CONTROLLER': 'text-blue-600 border-blue-300 bg-blue-50',
      'SENTINEL': 'text-green-600 border-green-300 bg-green-50',
      'INITIATOR': 'text-purple-600 border-purple-300 bg-purple-50',
      'FLEX': 'text-orange-600 border-orange-300 bg-orange-50'
    };
    return colors[role] || 'text-gray-500 border-gray-300 bg-gray-50';
  };

  const handleTabChange = (tab: string) => {
    if (!id) return;
    
    switch (tab) {
      case 'schedule':
        navigate(`/teams/${id}/schedule`);
        break;
      case 'settings':
        navigate(`/teams/${id}/settings`);
        break;
      default:
        navigate(`/teams/${id}`);
        break;
    }
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

  if (!team) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Team not found</h3>
              <Button onClick={() => navigate('/dashboard')} className="mt-4">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
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
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                  <p className="text-sm text-gray-500">
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Join Code:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {team.joinCode}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyJoinCode(team.joinCode)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{team.members.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Target</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {team.preferences?.hoursPerWeek || 0}h
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Training Days</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {team.preferences?.daysPerWeek || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={member.user.avatarHash ? 
                              `https://cdn.discordapp.com/avatars/${member.user.discordId}/${member.user.avatarHash}.png` : 
                              '/placeholder.svg'
                            }
                            alt={member.user.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{member.user.username}</h4>
                            <div className="flex items-center space-x-2">
                              {member.role && (
                                <Badge className={getRoleColor(member.role)}>
                                  {member.role}
                                </Badge>
                              )}
                              {member.isCoach && (
                                <Badge variant="secondary">Coach</Badge>
                              )}
                              {team.ownerId === member.user.id && (
                                <Badge variant="default">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Owner
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Schedule</CardTitle>
                  <CardDescription>
                    Manage your team's training schedule and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Schedule Management</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Schedule management features coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Settings</CardTitle>
                  <CardDescription>
                    Configure your team preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Team Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Team settings features coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}