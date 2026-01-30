import { User } from './user.model';
import { Task } from './task.model';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate?: Date;
  endDate?: Date;
  progress: number;
  owner: User;
  ownerId: number;
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStatistics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  progress: number;
}

