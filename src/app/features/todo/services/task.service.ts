import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../core/api-url';
import {BehaviorSubject, map, Subject, tap} from 'rxjs';
import {Todo, TodoCreate, TodoResponse} from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly state: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.state.asObservable();

  public readonly incompleteTasks = this.todos$.pipe(
    map(tasks => tasks.filter(task => !task.completed))
  );

  public readonly completedTasks = this.todos$.pipe(
    map(tasks => tasks.filter(task => task.completed))
  );

  getTask() {
    this.http.get<TodoResponse>(API_URL).subscribe(response => this.state.next(response.todos));
  }

  deleteTask(todo: Todo): void {
    this.http.delete<Todo>(API_URL + `/${todo.id}`).subscribe((deletedTodo) => {
      // Полностью удаляем задачу из массива (не просто помечаем)
      const tasks = this.state.value.filter(t => t.id !== todo.id);
      this.state.next(tasks);

    });
  }

  createTask(newTodo: TodoCreate) {
    this.http.post<Todo>(API_URL + 'add', newTodo).subscribe((todo) => {
      this.state.next([todo, ...this.state.value,])
    })
  }

}
