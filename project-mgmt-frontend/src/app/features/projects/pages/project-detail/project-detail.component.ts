import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { TaskService } from '../../../../core/services/task.service';
import { Project } from '../../../../core/models/project.model';
import { Task } from '../../../../core/models/task.model';
import { FilterStatusPipe } from '../../../../shared/pipes/filter-status.pipe';
import { TaskFormComponent } from '../../../tasks/components/task-form/task-form.component';
import { TaskDetailComponent } from '../../../tasks/components/task-detail/task-detail.component';
import { ProjectFormComponent } from '../../../projects/components/project-form/project-form.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FilterStatusPipe, 
    TaskFormComponent, 
    TaskDetailComponent,
    ProjectFormComponent
  ],
  template: `
    <div class="project-detail" *ngIf="project">
      <div class="project-header">
        <div class="header-content">
          <div class="header-top">
            <h1>{{ project.name }}</h1>
            <div class="header-actions">
              <button class="btn-edit" (click)="editProject()">✏️ Edit</button>
              <button class="btn-danger" (click)="deleteProject()">🗑️ Delete</button>
            </div>
          </div>
          <p class="description">{{ project.description }}</p>
          <div class="meta">
            <span class="badge" [class]="project.status">{{ project.status }}</span>
            <span class="owner">Owner: {{ project.owner.name }}</span>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat">
            <h3>{{ project.progress }}%</h3>
            <p>Complete</p>
          </div>
          <div class="stat">
            <h3>{{ tasks.length }}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="project.progress"></div>
        </div>
      </div>

      <div class="board-header">
        <h2>Task Board</h2>
        <button class="btn-primary" (click)="showTaskForm = true">+ New Task</button>
      </div>

      <div class="kanban-board">
        <div class="kanban-column">
          <div class="column-header todo">
            <h3>To Do</h3>
            <span class="count">{{ (tasks | filterStatus:'todo').length }}</span>
          </div>
          <div class="task-cards">
            <div 
              class="task-card" 
              *ngFor="let task of tasks | filterStatus:'todo'"
              (click)="viewTask(task)"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <span class="priority-dot" [class]="task.priority"></span>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-footer">
                <span class="assignee" *ngIf="task.assignee">
                  {{ task.assignee.name[0] }}
                </span>
                <span class="due-date" *ngIf="task.dueDate">
                  {{ task.dueDate | date:'MMM d' }}
                </span>
              </div>
              <div class="task-actions" (click)="$event.stopPropagation()">
                <button class="action-btn" (click)="moveTask(task, 'in-progress')">→</button>
                <button class="action-btn edit" (click)="editTask(task)">✏️</button>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="column-header in-progress">
            <h3>In Progress</h3>
            <span class="count">{{ (tasks | filterStatus:'in-progress').length }}</span>
          </div>
          <div class="task-cards">
            <div 
              class="task-card" 
              *ngFor="let task of tasks | filterStatus:'in-progress'"
              (click)="viewTask(task)"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <span class="priority-dot" [class]="task.priority"></span>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-footer">
                <span class="assignee" *ngIf="task.assignee">
                  {{ task.assignee.name[0] }}
                </span>
                <span class="due-date" *ngIf="task.dueDate">
                  {{ task.dueDate | date:'MMM d' }}
                </span>
              </div>
              <div class="task-actions" (click)="$event.stopPropagation()">
                <button class="action-btn" (click)="moveTask(task, 'todo')">←</button>
                <button class="action-btn" (click)="moveTask(task, 'done')">→</button>
                <button class="action-btn edit" (click)="editTask(task)">✏️</button>
              </div>
            </div>
          </div>
        </div>

        <div class="kanban-column">
          <div class="column-header done">
            <h3>Done</h3>
            <span class="count">{{ (tasks | filterStatus:'done').length }}</span>
          </div>
          <div class="task-cards">
            <div 
              class="task-card" 
              *ngFor="let task of tasks | filterStatus:'done'"
              (click)="viewTask(task)"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <span class="priority-dot" [class]="task.priority"></span>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-footer">
                <span class="assignee" *ngIf="task.assignee">
                  {{ task.assignee.name[0] }}
                </span>
                <span class="due-date" *ngIf="task.dueDate">
                  {{ task.dueDate | date:'MMM d' }}
                </span>
              </div>
              <div class="task-actions" (click)="$event.stopPropagation()">
                <button class="action-btn" (click)="moveTask(task, 'in-progress')">←</button>
                <button class="action-btn edit" (click)="editTask(task)">✏️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <app-task-form
      *ngIf="showTaskForm"
      [task]="selectedTask"
      [projectId]="project?.id!"
      (save)="saveTask($event)"
      (cancel)="closeTaskForm()"
    ></app-task-form>

    <!-- Task Detail Modal -->
    <app-task-detail
      *ngIf="showTaskDetail && selectedTask"
      [task]="selectedTask"
      (close)="closeTaskDetail()"
      (edit)="editTaskFromDetail($event)"
      (delete)="deleteTask($event)"
    ></app-task-detail>

    <!-- Project Form Modal (pour éditer) -->
    <app-project-form
      *ngIf="showProjectForm && project"
      [project]="project"
      (save)="saveProject($event)"
      (cancel)="closeProjectForm()"
    ></app-project-form>
  `,
  styles: [`
    .project-detail {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .project-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      gap: 2rem;
    }

    .header-content {
      flex: 1;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .project-header h1 {
      font-size: 2rem;
      color: #1f2937;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-edit, .btn-danger {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-edit {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-edit:hover {
      background: #e5e7eb;
    }

    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-danger:hover {
      background: #fecaca;
    }

    .description {
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .badge {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
    }

    .badge.active { background: #dbeafe; color: #1e40af; }
    .badge.completed { background: #d1fae5; color: #065f46; }
    .badge.on-hold { background: #fef3c7; color: #92400e; }

    .owner {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .header-stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat h3 {
      font-size: 2.5rem;
      color: #667eea;
      margin: 0;
    }

    .stat p {
      color: #6b7280;
      margin: 0;
    }

    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s;
    }

    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .board-header h2 {
      font-size: 1.5rem;
      color: #1f2937;
      margin: 0;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
    }

    .kanban-column {
      background: #f9fafb;
      border-radius: 12px;
      padding: 1rem;
      min-height: 400px;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .column-header.todo { background: #fef3c7; }
    .column-header.in-progress { background: #dbeafe; }
    .column-header.done { background: #d1fae5; }

    .column-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .count {
      background: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .task-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .task-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .task-card:hover .task-actions {
      opacity: 1;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
    }

    .task-header h4 {
      margin: 0;
      font-size: 0.875rem;
      color: #1f2937;
      flex: 1;
    }

    .priority-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .priority-dot.low { background: #10b981; }
    .priority-dot.medium { background: #f59e0b; }
    .priority-dot.high { background: #ef4444; }

    .task-desc {
      color: #6b7280;
      font-size: 0.75rem;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .assignee {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .due-date {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .action-btn {
      background: #f3f4f6;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: background 0.2s;
    }

    .action-btn:hover {
      background: #e5e7eb;
    }

    .action-btn.edit {
      background: #dbeafe;
    }

    .action-btn.edit:hover {
      background: #bfdbfe;
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  showTaskForm = false;
  showTaskDetail = false;
  showProjectForm = false;
  selectedTask: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject(projectId);
    this.loadTasks(projectId);
  }

  loadProject(id: number): void {
    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.project = project;
      }
    });
  }

  loadTasks(projectId: number): void {
    this.taskService.getAll({ projectId }).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }
    });
  }

  saveTask(taskData: any): void {
    if (this.selectedTask) {
      // Update existing task
      this.taskService.update(this.selectedTask.id, taskData).subscribe({
        next: () => {
          this.loadTasks(this.project!.id);
          this.closeTaskForm();
        }
      });
    } else {
      // Create new task
      this.taskService.create(taskData).subscribe({
        next: () => {
          this.loadTasks(this.project!.id);
          this.closeTaskForm();
        }
      });
    }
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  viewTask(task: Task): void {
    // Load full task with comments
    this.taskService.getById(task.id).subscribe({
      next: (fullTask) => {
        this.selectedTask = fullTask;
        this.showTaskDetail = true;
      }
    });
  }

  closeTaskDetail(): void {
    this.showTaskDetail = false;
    this.selectedTask = null;
  }

  editTask(task: Task): void {
    this.selectedTask = task;
    this.showTaskForm = true;
  }

  editTaskFromDetail(task: Task): void {
    this.showTaskDetail = false;
    this.selectedTask = task;
    this.showTaskForm = true;
  }

  deleteTask(taskId: number): void {
    this.taskService.delete(taskId).subscribe({
      next: () => {
        this.loadTasks(this.project!.id);
        this.closeTaskDetail();
      }
    });
  }

  moveTask(task: Task, newStatus: 'todo' | 'in-progress' | 'done'): void {
    this.taskService.update(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTasks(this.project!.id);
      }
    });
  }

  editProject(): void {
    this.showProjectForm = true;
  }

  saveProject(projectData: any): void {
    if (!this.project) return;
    
    this.projectService.update(this.project.id, projectData).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.showProjectForm = false;
        // Recharger les données
        this.loadProject(this.project.id);
      },
      error: (error) => {
        console.error('Error updating project:', error);
        alert('Failed to update project. Please try again.');
      }
    });
  }

  closeProjectForm(): void {
    this.showProjectForm = false;
  }

  deleteProject(): void {
    if (confirm(`Delete project "${this.project?.name}"?`)) {
      this.projectService.delete(this.project!.id).subscribe({
        next: () => {
          window.location.href = '/projects';
        }
      });
    }
  }
}