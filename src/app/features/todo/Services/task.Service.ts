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

  deleteTask(todo: Todo): void {
    this.http.delete<Todo>(`${API_URL}/${todo.id}`).subscribe({
      next: (deletedTodo) => {
        // Полностью удаляем задачу из массива (не просто помечаем)
        const tasks = this.state.value.filter(t => t.id !== todo.id);
        this.state.next(tasks);
      },
    });
  }
}
