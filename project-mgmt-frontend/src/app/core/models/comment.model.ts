import { Task } from './task.model';
import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  task: Task;
  taskId: number;
  author: User;
  authorId: number;
  createdAt: Date;
}

