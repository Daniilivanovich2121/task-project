import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../core/api-url';
import {BehaviorSubject, catchError, EMPTY, finalize, map, Subject} from 'rxjs';
import {Todo, TodoCreate, TodoResponse} from '../models/todo.model';
import {TASK_INITIAL_STATE, TaskStateModel} from '../models/task-state.model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly localStorageKey = 'todo_app_tasks';
  private readonly state: BehaviorSubject<TaskStateModel> = new BehaviorSubject<TaskStateModel>(this.getInitialState());
  public todos$ = this.state.asObservable();
  public readonly isLoading = this.todos$.pipe(map(state => state.isLoading))

  public readonly incompleteTasks = this.todos$.pipe(
    map(tasks => this.state.value.tasks.filter(task => !task.completed)));
  public readonly completedTasks = this.todos$.pipe(
    map(tasks => this.state.value.tasks.filter(task => task.completed)));


  private getInitialState(): TaskStateModel {
    const savedTasks = localStorage.getItem(this.localStorageKey);
    return {
      ...TASK_INITIAL_STATE,
      tasks: savedTasks ? JSON.parse(savedTasks) : TASK_INITIAL_STATE.tasks
    };
  }

  private saveTasks(tasks: Todo[]): void {
    const tasksCopy = structuredClone(tasks)    // Создаем глубокую копию с помощью structuredClone и  сохраням в Local Storage (оставил)
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasksCopy));
  }

  setState(partialState: Partial<TaskStateModel>) {
    const newState = {...this.state.value, ...partialState};
    this.state.next(newState);
    if (partialState.tasks) {
      this.saveTasks(newState.tasks);
    }
  }

  getTask() {
    const savedTasks = localStorage.getItem(this.localStorageKey); // Проверяем наличие данных в Local Storage (оставил)
    if (savedTasks && JSON.parse(savedTasks).length > 0) {
      // Если есть сохраненные задачи, используем их
      const tasks = JSON.parse(savedTasks);
      this.setState({
        tasks: tasks,
        isLoading: false,
        error: null
      });
    } else {
      this.setState({isLoading: true});       // Если нет сохраненных задач, делаем запрос к API(оставил)
      this.http.get<TodoResponse>(API_URL).pipe(
        finalize(() => this.setState({isLoading: false})),
        catchError((error) => {
          this.setState({error: error});
          return EMPTY;
        })
      ).subscribe(response => {
        this.setState({
          tasks: response.todos,
          error: null
        });
      });
    }
  }

  deleteTask(todo: Todo): void {
    const tasks: Todo[] = this.state.value.tasks.filter(t => t.id !== todo.id);
    this.setState({tasks: tasks});
  }

  createTask(newTodo: TodoCreate) {
    const todo: Todo = {
      ...newTodo,
      id: this.generateId(),
      completed: false,
      userId: 1
    };
    this.setState({tasks: [todo, ...this.state.value.tasks]});
  }

  editTask(editableTodo: Partial<Todo>, id: number) {
    const todos = this.state.value.tasks.map(t =>
      t.id === id ? {...t, ...editableTodo} : t
    );
    this.setState({tasks: todos});
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
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    } else {
      const updatedTask = {...task, completed: !task.completed};
      const taskIndex = tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTask;
      }
    }
    this.setState({tasks});
  }
  private generateId(): number {
    const tasks = this.state.value.tasks;
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }
}
