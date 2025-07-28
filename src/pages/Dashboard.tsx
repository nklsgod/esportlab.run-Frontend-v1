import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Users, TrendingUp, Plus, Save, Edit, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({ start: "", end: "", type: "available" });

  // Dummy Data
  const upcomingTrainings = [
    { id: 1, date: "2024-01-15", time: "19:00-21:00", type: "Aim Training", participants: 5, maxParticipants: 6 },
    { id: 2, date: "2024-01-17", time: "20:00-22:00", type: "Team Practice", participants: 6, maxParticipants: 6 },
    { id: 3, date: "2024-01-19", time: "18:30-20:30", type: "Strategy Review", participants: 4, maxParticipants: 6 },
    { id: 4, date: "2024-01-21", time: "17:00-19:00", type: "Scrimmage", participants: 3, maxParticipants: 6 },
    { id: 5, date: "2024-01-23", time: "19:30-21:30", type: "Map Practice", participants: 5, maxParticipants: 6 }
  ];

  const myAvailability = {
    "2024-01-15": [{ start: "19:00", end: "22:00", type: "available" }],
    "2024-01-16": [{ start: "18:00", end: "21:00", type: "available" }],
    "2024-01-17": [{ start: "20:00", end: "22:00", type: "busy", reason: "Arbeit" }],
    "2024-01-18": [{ start: "19:00", end: "21:00", type: "available" }],
    "2024-01-19": [{ start: "18:30", end: "20:30", type: "training" }],
    "2024-01-20": [{ start: "16:00", end: "19:00", type: "available" }],
    "2024-01-21": [{ start: "17:00", end: "19:00", type: "training" }]
  };

  const teamStats = {
    weeklyHours: 12,
    targetHours: 15,
    attendanceRate: 85,
    avgSkillRating: 2240
  };

  const getDayAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return myAvailability[dateStr as keyof typeof myAvailability] || [];
  };

  const getAvailabilityForDate = (dateStr: string) => {
    return myAvailability[dateStr as keyof typeof myAvailability] || [];
  };

  const isTrainingDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const availability = getDayAvailability(date);
    return availability.some(slot => slot.type === "training") || 
           upcomingTrainings.some(training => training.date === dateStr);
  };

  const isAvailableDay = (date: Date) => {
    const availability = getDayAvailability(date);
    return availability.some(slot => slot.type === "available");
  };

  const addTimeSlot = () => {
    // In real app, this would update the backend
    setShowAddAvailability(false);
    setNewTimeSlot({ start: "", end: "", type: "available" });
  };

  const joinTraining = (trainingId: number) => {
    // In real app, this would call the backend
    console.log("Joining training:", trainingId);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Plane deine Verfügbarkeiten und nimm an Trainings teil
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wöchentliche Stunden</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.weeklyHours}h</div>
            <p className="text-xs text-muted-foreground">
              von {teamStats.targetHours}h Ziel
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anwesenheit</CardTitle>
            <Users className="h-4 w-4 text-roles-controller" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Letzte 4 Wochen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-roles-sentinel" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgSkillRating}</div>
            <p className="text-xs text-muted-foreground">
              Team Durchschnitt
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nächstes Training</CardTitle>
            <CalendarIcon className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Heute</div>
            <p className="text-xs text-muted-foreground">
              19:00 Uhr
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar & Availability */}
        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Verfügbarkeits-Kalender
                </CardTitle>
                <CardDescription>
                  Trage deine verfügbaren Zeiten ein
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAddAvailability(!showAddAvailability)}>
                <Plus className="w-4 h-4 mr-2" />
                Zeit hinzufügen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border border-border/50 pointer-events-auto"
              modifiers={{
                training: (date) => isTrainingDay(date),
                available: (date) => isAvailableDay(date)
              }}
              modifiersStyles={{
                training: { 
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  border: '2px solid hsl(var(--primary))',
                  borderRadius: '6px'
                },
                available: { 
                  backgroundColor: 'hsl(var(--roles-sentinel) / 0.2)',
                  border: '1px solid hsl(var(--roles-sentinel))',
                  borderRadius: '6px'
                }
              }}
            />

            {showAddAvailability && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4">
                <h4 className="font-medium">Neue Verfügbarkeit für {format(selectedDate, "dd.MM.yyyy")}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Startzeit</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newTimeSlot.start}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Endzeit</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newTimeSlot.end}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, end: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timeType">Status</Label>
                  <Select value={newTimeSlot.type} onValueChange={(value) => setNewTimeSlot({...newTimeSlot, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Verfügbar</SelectItem>
                      <SelectItem value="busy">Beschäftigt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addTimeSlot} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddAvailability(false)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            )}

            {/* Selected Day Details */}
            <div className="space-y-3">
              <h4 className="font-medium">Zeiten für {format(selectedDate, "dd.MM.yyyy")}</h4>
              {getDayAvailability(selectedDate).length > 0 ? (
                getDayAvailability(selectedDate).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {slot.type === "available" && <CheckCircle className="w-4 h-4 text-roles-sentinel" />}
                      {slot.type === "busy" && <XCircle className="w-4 h-4 text-destructive" />}
                      {slot.type === "training" && <CalendarIcon className="w-4 h-4 text-primary" />}
                      <span>{slot.start} - {slot.end}</span>
                    </div>
                    <Badge variant={slot.type === "available" ? "default" : slot.type === "training" ? "secondary" : "destructive"}>
                      {slot.type === "available" ? "Verfügbar" : slot.type === "training" ? "Training" : "Beschäftigt"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-4 text-center bg-muted/30 rounded-lg">
                  Keine Zeiten eingetragen
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Trainings */}
        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Verfügbare Trainings
            </CardTitle>
            <CardDescription>
              Nimm an geplanten Trainingseinheiten teil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrainings.map((training) => {
              const availability = getAvailabilityForDate(training.date);
              const isAvailableForTime = availability.some(slot => 
                slot.type === "available" && 
                slot.start <= training.time.split('-')[0] && 
                slot.end >= training.time.split('-')[1]
              );
              const isAlreadyJoined = availability.some(slot => slot.type === "training");

              return (
                <div key={training.id} className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{training.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(training.date).toLocaleDateString('de-DE')} • {training.time}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${training.participants === training.maxParticipants ? 'border-destructive text-destructive' : 'border-primary text-primary'}`}>
                      {training.participants}/{training.maxParticipants}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAvailableForTime && <CheckCircle className="w-4 h-4 text-roles-sentinel" />}
                      {!isAvailableForTime && !isAlreadyJoined && <XCircle className="w-4 h-4 text-destructive" />}
                      <span className="text-sm text-muted-foreground">
                        {isAlreadyJoined ? "Bereits beigetreten" : 
                         isAvailableForTime ? "Du bist verfügbar" : "Du bist nicht verfügbar"}
                      </span>
                    </div>
                    
                    <Button 
                      variant={isAlreadyJoined ? "outline" : "gaming"}
                      size="sm"
                      disabled={training.participants >= training.maxParticipants || (!isAvailableForTime && !isAlreadyJoined)}
                      onClick={() => joinTraining(training.id)}
                    >
                      {isAlreadyJoined ? "Beigetreten" : 
                       training.participants >= training.maxParticipants ? "Voll" : "Beitreten"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};