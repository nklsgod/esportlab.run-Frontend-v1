export interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string | null;
  avatarHash: string | null;
  avatarUrl: string | null;
  email: string | null;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  joinCode: string;
  createdAt: string;
}

export interface TeamDetail extends Team {
  owner: {
    id: string;
    username: string;
    discordId: string;
    avatarHash: string | null;
  };
  members: TeamMember[];
  preferences: TeamPreference | null;
}

export interface TeamMember {
  id: string;
  role: 'DUELLIST' | 'CONTROLLER' | 'SENTINEL' | 'INITIATOR' | 'FLEX' | null;
  isCoach: boolean;
  user: {
    id: string;
    username: string;
    discordId: string;
    avatarHash: string | null;
  };
}

export interface TeamPreference {
  id: string;
  daysPerWeek: number;
  hoursPerWeek: number;
  minSlotMinutes: number;
  maxSlotMinutes: number;
}

export interface Availability {
  id: string;
  weekday: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: number; // minutes since midnight
  endTime: number;
  priority: number;
}

export interface Task {
  id: string;
  scope: 'TEAM' | 'COACH' | 'ROLE';
  title: string;
  description: string | null;
  role: 'DUELLIST' | 'CONTROLLER' | 'SENTINEL' | 'INITIATOR' | 'FLEX' | null;
  isCoachOnly: boolean;
  status: string;
  dueAt: string | null;
  createdAt: string;
  assignee: {
    id: string;
    user: {
      id: string;
      username: string;
      discordId: string;
      avatarHash: string | null;
    };
  } | null;
}