import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ project ? 'Edit Project' : 'New Project' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Project Name *</label>
            <input 
              id="name"
              type="text" 
              formControlName="name"
              placeholder="Enter project name"
              [class.error]="projectForm.get('name')?.invalid && projectForm.get('name')?.touched"
            />
            <div class="error-message" *ngIf="projectForm.get('name')?.invalid && projectForm.get('name')?.touched">
              Project name is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description"
              formControlName="description"
              rows="4"
              placeholder="Describe the project"
              [class.error]="projectForm.get('description')?.invalid && projectForm.get('description')?.touched"
            ></textarea>
            <div class="error-message" *ngIf="projectForm.get('description')?.invalid && projectForm.get('description')?.touched">
              Description is required
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status">
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div class="form-group">
              <label for="progress">Progress (%)</label>
              <input 
                id="progress"
                type="number" 
                formControlName="progress"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input 
                id="startDate"
                type="date" 
                formControlName="startDate"
              />
            </div>

            <div class="form-group">
              <label for="endDate">End Date</label>
              <input 
                id="endDate"
                type="date" 
                formControlName="endDate"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="projectForm.invalid || loading">
              {{ loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
    }

    form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      flex: 1;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.875rem;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }

    input.error, textarea.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }
  `]
})
export class ProjectFormComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  projectForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['active'],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description,
        status: this.project.status,
        progress: this.project.progress,
        startDate: this.project.startDate ? new Date(this.project.startDate).toISOString().split('T')[0] : '',
        endDate: this.project.endDate ? new Date(this.project.endDate).toISOString().split('T')[0] : ''
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.loading = true;
    const formValue = this.projectForm.value;
    
    const projectData = {
      ...formValue,
      startDate: formValue.startDate || undefined,
      endDate: formValue.endDate || undefined
    };

    this.save.emit(projectData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

