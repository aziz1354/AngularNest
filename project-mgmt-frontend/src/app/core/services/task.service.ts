import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks(filters?: { projectId?: number; assigneeId?: number }): void {
    let params = new HttpParams();
    if (filters?.projectId) params = params.set('projectId', filters.projectId.toString());
    if (filters?.assigneeId) params = params.set('assigneeId', filters.assigneeId.toString());

    this.http.get<Task[]>(this.apiUrl, { params })
      .subscribe(tasks => this.tasksSubject.next(tasks));
  }

  getAll(filters?: { projectId?: number; assigneeId?: number }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.projectId) params = params.set('projectId', filters.projectId.toString());
    if (filters?.assigneeId) params = params.set('assigneeId', filters.assigneeId.toString());

    return this.http.get<Task[]>(this.apiUrl, { params })
      .pipe(tap(tasks => this.tasksSubject.next(tasks)));
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(tap(() => this.loadTasks()));
  }

  update(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(tap(() => this.loadTasks()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadTasks()));
  }

 updateStatus(id: number, status: 'todo' | 'in-progress' | 'done'): Observable<Task> {
  return this.update(id, { status });
}
}
