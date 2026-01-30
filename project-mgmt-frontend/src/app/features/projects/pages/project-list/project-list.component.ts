import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Project } from '../../../../core/models/project.model';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProjectFormComponent],
  template: `
    <div class="projects-page">
      <div class="page-header">
        <h1>Projects</h1>
        <button class="btn-primary" (click)="showCreateForm = true">+ New Project</button>
      </div>

      <!-- Project Form Modal -->
      <app-project-form
        *ngIf="showCreateForm"
        (save)="createProjectFromForm($event)"
        (cancel)="showCreateForm = false"
      ></app-project-form>

      <!-- Projects Grid -->
      <div class="projects-grid" *ngIf="projects.length > 0; else noProjects">
        <div class="project-card" *ngFor="let project of projects" [routerLink]="['/projects', project.id]">
          <div class="card-header">
            <h3>{{ project.name }}</h3>
            <span class="status-badge" [class]="project.status">{{ project.status }}</span>
          </div>
          <p class="description">{{ project.description }}</p>
          <div class="card-footer">
            <div class="owner">
              <span class="avatar">{{ project.owner.name[0] }}</span>
              <span>{{ project.owner.name }}</span>
            </div>
            <div class="progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="project.progress"></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
          </div>
          <div class="task-count">
            {{ project.tasks?.length || 0 }} tasks
          </div>
        </div>
      </div>

      <ng-template #noProjects>
        <div class="empty-state">
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .projects-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      color: #1f2937;
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

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .card-header h3 {
      font-size: 1.25rem;
      color: #1f2937;
      margin: 0;
      flex: 1;
    }

    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.on-hold {
      background: #fef3c7;
      color: #92400e;
    }

    .description {
      color: #6b7280;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .owner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 0.75rem;
      color: #6b7280;
      min-width: 35px;
    }

    .task-count {
      font-size: 0.875rem;
      color: #6b7280;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  showCreateForm = false;
  newProject: any = {
    name: '',
    description: '',
    status: 'active',
    progress: 0
  };

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
      }
    });
  }

  createProject(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const projectData = {
      ...this.newProject,
      ownerId: currentUser.id
    };

    this.projectService.create(projectData).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.newProject = { name: '', description: '', status: 'active', progress: 0 };
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        alert('Failed to create project. Please try again.');
      }
    });
  }

  createProjectFromForm(projectData: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const completeProjectData = {
      ...projectData,
      ownerId: currentUser.id
    };

    this.projectService.create(completeProjectData).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        alert('Failed to create project. Please try again.');
      }
    });
  }
}