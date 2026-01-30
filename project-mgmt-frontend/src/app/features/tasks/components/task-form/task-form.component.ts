import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ task ? 'Edit Task' : 'New Task' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title"
              type="text" 
              formControlName="title"
              placeholder="Enter task title"
              [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
            />
            <div class="error-message" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
              Title is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description"
              formControlName="description"
              rows="4"
              placeholder="Describe the task"
              [class.error]="taskForm.get('description')?.invalid && taskForm.get('description')?.touched"
            ></textarea>
            <div class="error-message" *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched">
              Description is required
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" formControlName="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="assigneeId">Assign To</label>
              <select id="assigneeId" formControlName="assigneeId">
                <option [value]="null">Unassigned</option>
                <option *ngFor="let user of users" [value]="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="estimatedHours">Estimated Hours</label>
              <input 
                id="estimatedHours"
                type="number" 
                formControlName="estimatedHours"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input 
              id="dueDate"
              type="date" 
              formControlName="dueDate"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="taskForm.invalid || loading">
              {{ loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
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
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() projectId!: number;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  users: User[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['todo'],
      priority: ['medium'],
      assigneeId: [null],
      estimatedHours: [0],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        assigneeId: this.task.assigneeId,
        estimatedHours: this.task.estimatedHours,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.loading = true;
    const formValue = this.taskForm.value;
    
    const taskData = {
      ...formValue,
      projectId: this.projectId,
      assigneeId: formValue.assigneeId || undefined,
      dueDate: formValue.dueDate || undefined
    };

    this.save.emit(taskData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

