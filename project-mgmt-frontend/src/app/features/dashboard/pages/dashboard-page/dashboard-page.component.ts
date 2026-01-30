import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';
import { TaskService } from '../../../../core/services/task.service';
import { Project } from '../../../../core/models/project.model';
import { Task } from '../../../../core/models/task.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Welcome back, {{ currentUser?.name }}!</h1>
        <p class="subtitle">Here's what's happening with your projects</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon projects"></div>
          <div class="stat-content">
            <h3>{{ totalProjects }}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon tasks">✓</div>
          <div class="stat-content">
            <h3>{{ totalTasks }}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon progress"></div>
          <div class="stat-content">
            <h3>{{ inProgressTasks }}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed"></div>
          <div class="stat-content">
            <h3>{{ completedTasks }}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="section">
          <div class="section-header">
            <h2>Recent Projects</h2>
            <a routerLink="/projects" class="view-all">View All →</a>
          </div>
          <div class="project-list" *ngIf="recentProjects.length > 0; else noProjects">
            <div class="project-item" *ngFor="let project of recentProjects" [routerLink]="['/projects', project.id]">
              <div class="project-info">
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                  <span class="badge" [class]="project.status">{{ project.status }}</span>
                  <span class="tasks-count">{{ project.tasks?.length || 0 }} tasks</span>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="project.progress"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
          </div>
          <ng-template #noProjects>
            <p class="empty-state">No projects yet. <a routerLink="/projects">Create your first project!</a></p>
          </ng-template>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>My Tasks</h2>
            <a routerLink="/tasks" class="view-all">View All →</a>
          </div>
          <div class="task-list" *ngIf="myTasks.length > 0; else noTasks">
            <div class="task-item" *ngFor="let task of myTasks">
              <div class="task-priority" [class]="task.priority"></div>
              <div class="task-content">
                <h4>{{ task.title }}</h4>
                <p class="task-project">{{ task.project.name }}</p>
                <div class="task-meta">
                  <span class="badge" [class]="task.status">{{ task.status }}</span>
                  <span class="due-date" *ngIf="task.dueDate">Due: {{ task.dueDate | date:'MMM d' }}</span>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noTasks>
            <p class="empty-state">No tasks assigned yet.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.projects { background: #dbeafe; }
    .stat-icon.tasks { background: #d1fae5; }
    .stat-icon.progress { background: #fef3c7; }
    .stat-icon.completed { background: #e0e7ff; }

    .stat-content h3 {
      font-size: 2rem;
      color: #1f2937;
      margin: 0;
    }

    .stat-content p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
      color: #1f2937;
      margin: 0;
    }

    .view-all {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .project-list, .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-item {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .project-item:hover {
      border-color: #667eea;
      box-shadow: 0 2px 4px rgba(102,126,234,0.1);
    }

    .project-info h3 {
      font-size: 1rem;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .project-info p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0 0 0.75rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-meta {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .tasks-count {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .progress-bar {
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .task-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .task-item:hover {
      border-color: #667eea;
      box-shadow: 0 2px 4px rgba(102,126,234,0.1);
    }

    .task-priority {
      width: 4px;
      border-radius: 2px;
    }

    .task-priority.low { background: #10b981; }
    .task-priority.medium { background: #f59e0b; }
    .task-priority.high { background: #ef4444; }

    .task-content {
      flex: 1;
    }

    .task-content h4 {
      font-size: 0.875rem;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .task-project {
      color: #6b7280;
      font-size: 0.75rem;
      margin: 0 0 0.5rem 0;
    }

    .task-meta {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .badge.active, .badge.in-progress {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge.completed, .badge.done {
      background: #d1fae5;
      color: #065f46;
    }

    .badge.on-hold, .badge.todo {
      background: #fef3c7;
      color: #92400e;
    }

    .due-date {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .empty-state {
      text-align: center;
      color: #9ca3af;
      padding: 2rem;
    }

    .empty-state a {
      color: #667eea;
      text-decoration: none;
    }

    .empty-state a:hover {
      text-decoration: underline;
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  currentUser: User | null = null;
  recentProjects: Project[] = [];
  myTasks: Task[] = [];
  
  totalProjects = 0;
  totalTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load projects
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.recentProjects = projects.slice(0, 5);
        this.totalProjects = projects.filter(p => p.status === 'active').length;
      }
    });

    // Load tasks
    if (this.currentUser) {
      this.taskService.getAll({ assigneeId: this.currentUser.id }).subscribe({
        next: (tasks) => {
          this.myTasks = tasks.slice(0, 6);
          this.totalTasks = tasks.length;
          this.inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
          this.completedTasks = tasks.filter(t => t.status === 'done').length;
        }
      });
    }
  }
}

