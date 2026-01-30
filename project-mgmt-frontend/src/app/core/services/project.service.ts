import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Project, ProjectStatistics } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projects';
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadProjects(): void {
    this.http.get<Project[]>(this.apiUrl)
      .subscribe(projects => this.projectsSubject.next(projects));
  }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl)
      .pipe(tap(projects => this.projectsSubject.next(projects)));
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  getByOwner(ownerId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  getStatistics(id: number): Observable<ProjectStatistics> {
    return this.http.get<ProjectStatistics>(`${this.apiUrl}/${id}/statistics`);
  }

  create(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project)
      .pipe(tap(() => this.loadProjects()));
  }

  update(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, project)
      .pipe(tap(() => this.loadProjects()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadProjects()));
  }
}

