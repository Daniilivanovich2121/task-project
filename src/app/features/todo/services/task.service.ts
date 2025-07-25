import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../core/api-url';
import {BehaviorSubject, catchError, EMPTY, finalize, map, Subject, tap} from 'rxjs';
import {Todo, TodoCreate, TodoResponse} from '../models/todo.model';
import {TASK_INITIAL_STATE, TaskStateModel} from '../models/task-state.model';
import {CdkDragDrop, moveItemInArray, } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly state: BehaviorSubject<TaskStateModel> = new BehaviorSubject<TaskStateModel>(TASK_INITIAL_STATE);
  public todos$ = this.state.asObservable();
  public readonly isLoading = this.todos$.pipe(
    map(state => state.isLoading),
  )

  setState(partialState: Partial<TaskStateModel>) {
    this.state.next({...this.state.value, ...partialState});
  }

  public readonly incompleteTasks = this.todos$.pipe(
    map(tasks => this.state.value.tasks.filter(task => !task.completed))
  );

  public readonly completedTasks = this.todos$.pipe(
    map(tasks => this.state.value.tasks.filter(task => task.completed))
  );

  getTask() {
    this.setState({isLoading: true});
    this.http.get<TodoResponse>(API_URL).pipe(
      finalize(() => this.setState({isLoading: false})),
      catchError((error) => {
        this.setState({error: error})
        return EMPTY;
      })
    ).subscribe(response => {
      this.setState({tasks: response.todos});
      this.setState({error: null});
    });
  }

  deleteTask(todo: Todo): void {
    const tasks: Todo[] = this.state.value.tasks.filter(t => t.id !== todo.id);
    this.http.delete<Todo>(API_URL + `/${todo.id}`).subscribe(() => this.setState({tasks: tasks}))//спросить как улучшить
  }

  createTask(newTodo: TodoCreate) {
    this.http.post<Todo>(API_URL + 'add', newTodo).subscribe((todo) => {
      this.setState({tasks: [todo, ...this.state.value.tasks]})
    })
  }

  editTask(editableTodo: Partial<Todo>, id: number) {
    this.http.put<Todo>(API_URL + `${id}`, editableTodo).subscribe(todo => {
      const todos = this.state.value.tasks.map(t =>
        t.id === todo.id ? todo : t
      );
      this.setState({tasks: todos})
    })
  }

  updateTaskPosition(event: CdkDragDrop<Todo[]>): void {
    const currentState = this.state.value;
    const tasks = [...currentState.tasks];
    const task = event.item.data;

    if (!task) {
      console.error('Task is undefined in drag and drop');
      return;
    }

    if (event.previousContainer === event.container) {
      // Перемещение внутри одной колонки
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    } else {
      // Перенос между колонками - меняем статус только локально
      const updatedTask = { ...task, completed: !task.completed };

      // Находим индекс задачи в общем массиве
      const taskIndex = tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTask;
      }
    }
    this.setState({ tasks });
  }

}
