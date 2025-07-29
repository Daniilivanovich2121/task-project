import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../core/api-url';
import { catchError, EMPTY, finalize, map,} from 'rxjs';
import {Todo, TodoCreate, TodoResponse} from '../models/todo.model';
import {TASK_INITIAL_STATE, TaskStateModel} from '../models/task-state.model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly localStorageKey = 'todo_app_tasks';
  private readonly state = signal<TaskStateModel>(this.getInitialState());

  public todosState = computed(() => this.state());
  public incompleteTasks = computed(() => this.state().tasks.filter(task => !task.completed));
  public completedTasks = computed(() => this.state().tasks.filter(task => task.completed));

  getTask():void {
    const savedTasks = localStorage.getItem(this.localStorageKey);
    if (savedTasks && JSON.parse(savedTasks).length > 0) {
      const tasks = JSON.parse(savedTasks);
      this.setState({
        tasks: tasks,
        isLoading: false,
        error: null
      });
    } else {
      this.setState({isLoading: true});
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
    const tasks: Todo[] = this.state().tasks.filter(t => t.id !== todo.id);
    this.setState({tasks: tasks});
  }

  createTask(newTodo: TodoCreate):void {
    const todo: Todo = {
      ...newTodo,
      id: this.generateId(),
      completed: false,
      userId: 1
    };
    this.setState({tasks: [todo, ...this.state().tasks]});
  }

  editTask(editableTodo: Partial<Todo>, id: number): void {
    const todos = this.state().tasks.map(t =>
      t.id === id ? {...t, ...editableTodo} : t
    );
    this.setState({tasks: todos});
  }

  updateTaskPosition(event: CdkDragDrop<Todo[]>): void {
    const currentState = this.state();
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

  private getInitialState(): TaskStateModel {
    const savedTasks = localStorage.getItem(this.localStorageKey);
    return {
      ...TASK_INITIAL_STATE,
      tasks: savedTasks ? JSON.parse(savedTasks) : TASK_INITIAL_STATE.tasks
    };
  }

  private saveTasksToLocalStorage(tasks: Todo[]): void {
    const tasksCopy = structuredClone(tasks)
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasksCopy));
  }

  private setState(partialState: Partial<TaskStateModel>):void {
    const newState = {...this.state(), ...partialState};
    this.state.set(newState);
    if (partialState.tasks) {
      this.saveTasksToLocalStorage(newState.tasks);
    }
  }

  private generateId(): number {
    const tasks = this.state().tasks;
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }
}
