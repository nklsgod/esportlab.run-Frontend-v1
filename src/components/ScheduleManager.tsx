import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { apiClient } from '@/lib/api';
import type { Availability, TeamDetail } from '@/types/api';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Save, Users, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface ScheduleManagerProps {
  team: TeamDetail;
  onUpdate?: () => void;
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

export function ScheduleManager({ team, onUpdate }: ScheduleManagerProps) {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newSlot, setNewSlot] = useState({
    weekday: 'MON' as WeekdayKey,
    startTime: '',
    endTime: '',
    priority: 1
  });

  useEffect(() => {
    loadAvailability();
  }, [team.id]);

  const loadAvailability = async () => {
    try {
      const response = await apiClient.getAvailability(team.id);
      setAvailability(response.availability);
    } catch (error) {
      console.error('Failed to load availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleAddSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Error",
        description: "Please select both start and end times",
        variant: "destructive",
      });
      return;
    }

    const startMinutes = timeToMinutes(newSlot.startTime);
    const endMinutes = timeToMinutes(newSlot.endTime);

    if (startMinutes >= endMinutes) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const newAvailabilitySlot = {
      weekday: newSlot.weekday,
      startTime: startMinutes,
      endTime: endMinutes,
      priority: newSlot.priority
    };

    try {
      const updatedAvailability = [...availability, newAvailabilitySlot as any];
      const response = await apiClient.updateAvailability(team.id, updatedAvailability);
      setAvailability(response.availability);
      
      setNewSlot({
        weekday: 'MON',
        startTime: '',
        endTime: '',
        priority: 1
      });

      toast({
        title: "Success",
        description: "Availability slot added successfully",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Failed to add availability slot:', error);
      toast({
        title: "Error",
        description: "Failed to add availability slot",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSlot = async (slotId: string) => {
    try {
      const updatedAvailability = availability.filter(slot => slot.id !== slotId);
      const response = await apiClient.updateAvailability(team.id, updatedAvailability);
      setAvailability(response.availability);

      toast({
        title: "Success",
        description: "Availability slot removed successfully",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Failed to remove availability slot:', error);
      toast({
        title: "Error",
        description: "Failed to remove availability slot",
        variant: "destructive",
      });
    }
  };

  const getAvailabilityForWeekday = (weekday: WeekdayKey) => {
    return availability.filter(slot => slot.weekday === weekday);
  };

  const getWeekDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    return WEEKDAYS.map((day, index) => ({
      ...day,
      date: addDays(start, index)
    }));
  };

  const hasAvailabilityOnDay = (date: Date) => {
    const weekday = WEEKDAYS.find(day => day.index === date.getDay())?.key;
    if (!weekday) return false;
    return getAvailabilityForWeekday(weekday).length > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* Team Preferences */}
          {team.preferences && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{team.preferences.daysPerWeek}</div>
                    <div className="text-sm text-muted-foreground">Days per Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{team.preferences.hoursPerWeek}h</div>
                    <div className="text-sm text-muted-foreground">Hours per Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{team.preferences.minSlotMinutes}min</div>
                    <div className="text-sm text-muted-foreground">Min Session</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{team.preferences.maxSlotMinutes}min</div>
                    <div className="text-sm text-muted-foreground">Max Session</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Availability Slot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Availability
              </CardTitle>
              <CardDescription>
                Set when your team is available for training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="weekday">Day</Label>
                  <Select value={newSlot.weekday} onValueChange={(value: WeekdayKey) => setNewSlot({...newSlot, weekday: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map(day => (
                        <SelectItem key={day.key} value={day.key}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newSlot.priority.toString()} onValueChange={(value) => setNewSlot({...newSlot, priority: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddSlot} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Weekly Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {WEEKDAYS.map(day => {
                  const dayAvailability = getAvailabilityForWeekday(day.key);
                  return (
                    <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 font-medium">{day.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {dayAvailability.length > 0 ? (
                            dayAvailability.map(slot => (
                              <Badge key={slot.id} className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {minutesToTime(slot.startTime)} - {minutesToTime(slot.endTime)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleRemoveSlot(slot.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No availability set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Training Calendar</CardTitle>
                <CardDescription>
                  Overview of your team's availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    available: (date) => hasAvailabilityOnDay(date)
                  }}
                  modifiersStyles={{
                    available: { 
                      backgroundColor: 'hsl(var(--primary) / 0.2)',
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: '6px'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Week View */}
            <Card>
              <CardHeader>
                <CardTitle>Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getWeekDates().map(({ key, label, date }) => {
                    const dayAvailability = getAvailabilityForWeekday(key);
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                      <div key={key} className={`p-3 rounded-lg border ${isToday ? 'bg-primary/5 border-primary' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(date, 'MMM d')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {dayAvailability.length > 0 ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">
                                  {dayAvailability.length} slot{dayAvailability.length > 1 ? 's' : ''}
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-muted-foreground">
                                  No availability
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {dayAvailability.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {dayAvailability.map(slot => (
                              <Badge key={slot.id} variant="outline" className="text-xs">
                                {minutesToTime(slot.startTime)}-{minutesToTime(slot.endTime)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}