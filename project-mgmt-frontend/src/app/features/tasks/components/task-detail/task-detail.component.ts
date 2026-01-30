import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { Comment } from '../../../../core/models/comment.model';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-content">
            <h2>{{ task.title }}</h2>
            <div class="badges">
              <span class="badge" [class]="task.status">{{ task.status }}</span>
              <span class="badge priority" [class]="task.priority">{{ task.priority }}</span>
            </div>
          </div>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <div class="modal-body">
          <div class="task-info">
            <h3>Description</h3>
            <p>{{ task.description }}</p>

            <div class="info-grid">
              <div class="info-item">
                <span class="label">Assigned to:</span>
                <span class="value">{{ task.assignee?.name || 'Unassigned' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Estimated:</span>
                <span class="value">{{ task.estimatedHours }}h</span>
              </div>
              <div class="info-item" *ngIf="task.dueDate">
                <span class="label">Due date:</span>
                <span class="value">{{ task.dueDate | date:'MMM d, yyyy' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Created:</span>
                <span class="value">{{ task.createdAt | timeAgo }}</span>
              </div>
            </div>
          </div>

          <div class="comments-section">
            <h3>Comments ({{ comments.length }})</h3>
            
            <div class="comments-list" *ngIf="comments.length > 0">
              <div class="comment" *ngFor="let comment of comments">
                <div class="comment-header">
                  <div class="author">
                    <div class="avatar">{{ comment.author.name[0] }}</div>
                    <div class="author-info">
                      <span class="name">{{ comment.author.name }}</span>
                      <span class="time">{{ comment.createdAt | timeAgo }}</span>
                    </div>
                  </div>
                  <button 
                    class="delete-comment-btn" 
                    *ngIf="comment.authorId === currentUserId"
                    (click)="deleteComment(comment.id)"
                  >
                    🗑️
                  </button>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
            </div>

            <div class="empty-state" *ngIf="comments.length === 0">
              <p>No comments yet. Be the first to comment!</p>
            </div>

            <div class="add-comment">
              <textarea 
                [(ngModel)]="newComment"
                placeholder="Add a comment..."
                rows="3"
              ></textarea>
              <button 
                class="btn-primary" 
                (click)="addComment()"
                [disabled]="!newComment.trim() || addingComment"
              >
                {{ addingComment ? 'Adding...' : 'Add Comment' }}
              </button>
            </div>
          </div>

          <div class="actions">
            <button class="btn-secondary" (click)="onEdit()">✏️ Edit Task</button>
            <button class="btn-danger" (click)="onDelete()">🗑️ Delete Task</button>
          </div>
        </div>
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
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-content {
      flex: 1;
    }

    .modal-header h2 {
      margin: 0 0 0.75rem 0;
      font-size: 1.5rem;
      color: #1f2937;
    }

    .badges {
      display: flex;
      gap: 0.5rem;
    }

    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 500;
    }

    .badge.todo { background: #fef3c7; color: #92400e; }
    .badge.in-progress { background: #dbeafe; color: #1e40af; }
    .badge.done { background: #d1fae5; color: #065f46; }
    .badge.priority.low { background: #d1fae5; color: #065f46; }
    .badge.priority.medium { background: #fef3c7; color: #92400e; }
    .badge.priority.high { background: #fee2e2; color: #991b1b; }

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

    .modal-body {
      padding: 1.5rem;
    }

    .task-info h3 {
      font-size: 1rem;
      color: #374151;
      margin-bottom: 0.75rem;
    }

    .task-info p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .value {
      font-weight: 500;
      color: #1f2937;
    }

    .comments-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .comments-section h3 {
      font-size: 1rem;
      color: #374151;
      margin-bottom: 1rem;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .comment {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
    }

    .author {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-weight: 500;
      color: #1f2937;
      font-size: 0.875rem;
    }

    .time {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .delete-comment-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      font-size: 1rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .delete-comment-btn:hover {
      opacity: 1;
    }

    .comment-content {
      color: #374151;
      line-height: 1.5;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .add-comment {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .add-comment textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      font-family: inherit;
      resize: vertical;
    }

    .add-comment textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary, .btn-secondary, .btn-danger {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      align-self: flex-end;
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
      flex: 1;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
      flex: 1;
    }

    .btn-danger:hover {
      background: #fecaca;
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  comments: Comment[] = [];
  newComment = '';
  addingComment = false;
  currentUserId: number | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?.id || null;
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getAll(this.task.id).subscribe({
      next: (comments) => {
        this.comments = comments;
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.currentUserId) return;

    this.addingComment = true;
    this.commentService.create({
      content: this.newComment,
      taskId: this.task.id,
      authorId: this.currentUserId
    }).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
        this.addingComment = false;
      },
      error: () => {
        this.addingComment = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Delete this comment?')) {
      this.commentService.delete(commentId).subscribe({
        next: () => {
          this.loadComments();
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    if (confirm(`Delete task "${this.task.title}"?`)) {
      this.delete.emit(this.task.id);
    }
  }
}
