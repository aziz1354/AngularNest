import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) {}

  getAll(taskId?: number): Observable<Comment[]> {
    let params = new HttpParams();
    if (taskId) params = params.set('taskId', taskId.toString());
    return this.http.get<Comment[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  create(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  update(id: number, comment: Partial<Comment>): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/${id}`, comment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

