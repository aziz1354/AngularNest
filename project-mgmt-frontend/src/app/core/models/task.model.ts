import { Project } from './project.model';
import { User } from './user.model';
import { Comment } from './comment.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  estimatedHours: number;
  project: Project;
  projectId: number;
  assignee?: User;
  assigneeId?: number;
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
