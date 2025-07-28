import type { User, Team, TeamDetail, TeamPreference, Availability, Task } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:8080';
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, { ...options, headers });
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          return retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { accessToken, refreshToken: newRefreshToken } = await response.json();
        this.setTokens(accessToken, newRefreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Auth methods
  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Team methods
  async getTeams() {
    return this.request<{ teams: Team[] }>('/teams');
  }

  async createTeam(name: string) {
    return this.request<{ team: Team }>('/teams', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async joinTeam(joinCode: string) {
    return this.request<{ team: Team }>('/teams/join', {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    });
  }

  async getTeam(teamId: string) {
    return this.request<{ team: TeamDetail }>(`/teams/${teamId}`);
  }

  async updateTeamPreferences(teamId: string, preferences: Partial<TeamPreference>) {
    return this.request<{ preferences: TeamPreference }>(`/teams/${teamId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Availability methods
  async getAvailability(teamId: string) {
    return this.request<{ availability: Availability[] }>(`/teams/${teamId}/availability`);
  }

  async updateAvailability(teamId: string, availability: Omit<Availability, 'id'>[]) {
    return this.request<{ availability: Availability[] }>(`/teams/${teamId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  // Task methods
  async getTasks(teamId: string) {
    return this.request<{ tasks: Task[] }>(`/teams/${teamId}/tasks`);
  }

  async createTask(teamId: string, task: Omit<Task, 'id' | 'createdAt' | 'assignee'>) {
    return this.request<{ task: Task }>(`/teams/${teamId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(teamId: string, taskId: string, updates: Partial<Task>) {
    return this.request<{ task: Task }>(`/teams/${teamId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(teamId: string, taskId: string) {
    return this.request<void>(`/teams/${teamId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();