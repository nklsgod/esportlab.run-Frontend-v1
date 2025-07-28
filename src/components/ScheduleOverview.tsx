import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from '@/lib/api';
import type { Team, Availability } from '@/types/api';
import { Calendar, Clock, Users, ArrowRight, CalendarDays, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay, isToday, isTomorrow } from "date-fns";
import { useNavigate } from 'react-router-dom';

interface ScheduleOverviewProps {
  teams: Team[];
}

interface TeamScheduleData {
  team: Team;
  availability: Availability[];
  totalHours: number;
  nextSession?: {
    day: string;
    time: string;
    date: Date;
  };
}

type WeekdayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

const WEEKDAYS: { key: WeekdayKey; label: string; index: number }[] = [
  { key: 'MON', label: 'Monday', index: 1 },
  { key: 'TUE', label: 'Tuesday', index: 2 },
  { key: 'WED', label: 'Wednesday', index: 3 },
  { key: 'THU', label: 'Thursday', index: 4 },
  { key: 'FRI', label: 'Friday', index: 5 },
  { key: 'SAT', label: 'Saturday', index: 6 },
  { key: 'SUN', label: 'Sunday', index: 0 }
];

export function ScheduleOverview({ teams }: ScheduleOverviewProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState<TeamScheduleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllSchedules();
  }, [teams]);

  const loadAllSchedules = async () => {
    try {
      const schedulePromises = teams.map(async (team) => {
        try {
          const response = await apiClient.getAvailability(team.id);
          const availability = response.availability;
          
          // Calculate total weekly hours
          const totalHours = availability.reduce((total, slot) => {
            const duration = (slot.endTime - slot.startTime) / 60; // Convert minutes to hours
            return total + duration;
          }, 0);

          // Find next session
          const nextSession = findNextSession(availability);

          return {
            team,
            availability,
            totalHours,
            nextSession
          };
        } catch (error) {
          console.error(`Failed to load schedule for team ${team.name}:`, error);
          return {
            team,
            availability: [],
            totalHours: 0
          };
        }
      });

      const results = await Promise.all(schedulePromises);
      setScheduleData(results);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const findNextSession = (availability: Availability[]) => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Look for sessions in the next 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = addDays(now, i);
      const checkDay = checkDate.getDay();
      const weekdayKey = WEEKDAYS.find(day => day.index === checkDay)?.key;
      
      if (!weekdayKey) continue;

      const dayAvailability = availability.filter(slot => slot.weekday === weekdayKey);
      
      for (const slot of dayAvailability) {
        // If it's today, only consider future slots
        if (i === 0 && slot.startTime <= currentMinutes) continue;
        
        return {
          day: weekdayKey,
          time: minutesToTime(slot.startTime),
          date: checkDate
        };
      }
    }

    return undefined;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getSessionsToday = () => {
    const today = new Date().getDay();
    const weekdayKey = WEEKDAYS.find(day => day.index === today)?.key;
    if (!weekdayKey) return [];

    return scheduleData.flatMap(({ team, availability }) => 
      availability
        .filter(slot => slot.weekday === weekdayKey)
        .map(slot => ({
          team: team.name,
          teamId: team.id,
          time: `${minutesToTime(slot.startTime)} - ${minutesToTime(slot.endTime)}`,
          startTime: slot.startTime
        }))
    ).sort((a, b) => a.startTime - b.startTime);
  };

  const getUpcomingSessions = () => {
    return scheduleData
      .filter(data => data.nextSession)
      .map(data => ({
        ...data.nextSession!,
        team: data.team.name,
        teamId: data.team.id
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const formatSessionDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getTotalWeeklyHours = () => {
    return scheduleData.reduce((total, data) => total + data.totalHours, 0);
  };

  const getActiveTeamsCount = () => {
    return scheduleData.filter(data => data.availability.length > 0).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todaysSessions = getSessionsToday();
  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="space-y-6">
      {/* Schedule Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalWeeklyHours().toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Across all teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveTeamsCount()}</div>
            <p className="text-xs text-muted-foreground">
              With scheduled sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              Total teams
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>
              Your training sessions scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysSessions.length > 0 ? (
              <div className="space-y-3">
                {todaysSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teams/${session.teamId}`)}
                  >
                    <div>
                      <div className="font-medium">{session.team}</div>
                      <div className="text-sm text-muted-foreground">{session.time}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No sessions today</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enjoy your day off or schedule some training!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Next training sessions across all teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teams/${session.teamId}`)}
                  >
                    <div>
                      <div className="font-medium">{session.team}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatSessionDate(session.date)} at {session.time}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming sessions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up your team schedules to see upcoming training!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Schedule Summary
          </CardTitle>
          <CardDescription>
            Overview of all your teams' training schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.map(({ team, availability, totalHours, nextSession }) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/teams/${team.id}/schedule`)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium">{team.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{totalHours.toFixed(1)}h weekly</span>
                      <span>{availability.length} session{availability.length !== 1 ? 's' : ''}</span>
                      {nextSession && (
                        <Badge variant="outline" className="ml-2">
                          Next: {formatSessionDate(nextSession.date)} {nextSession.time}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Schedule
                  </Button>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
          
          {scheduleData.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No teams yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create or join a team to start scheduling training sessions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}