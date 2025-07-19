import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../core/api-url';
import {BehaviorSubject, Subject, tap} from 'rxjs';
import {Todo, TodoResponse} from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly state: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.state.asObservable();

  getTask() {
    this.http.get<TodoResponse>(API_URL).subscribe({
      next: response => this.state.next(response.todos)
    });
  }

  deleteTask(todo: Todo) {

    const tasks = this.state.value.filter(v => v.id !== todo.id)

    this.http.delete(`${API_URL}/${todo.id}`).pipe(
      tap(() => this.state.next(tasks))
    ).subscribe()
  }
}
