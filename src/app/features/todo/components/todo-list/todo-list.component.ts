import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {Todo, TodoCreate} from '../../models/todo.model';
import { map, Observable, tap } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import {CreateTodo} from '../create-todo/create-todo';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    TodoCardComponent,
    AsyncPipe,
    MatIcon,
    MatButton,
    MatProgressSpinner,
    MatProgressBar,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  public readonly taskService = inject(TaskService);
  public loading = true; // Добавляем флаг загрузки
  readonly dialog = inject(MatDialog);

  public readonly incompleteTasks$ = this.taskService.incompleteTasks
  public readonly completedTasks$ = this.taskService.completedTasks
  ngOnInit() {
    this.taskService.getTask()
  }
  deleteTask(task: Todo): void {
    this.loading = true;
    this.taskService.deleteTask(task);
    // Не нужно подписываться, так как сервис сам обновит состояние
    // Можно добавить setTimeout для сброса loading, если нужно
    setTimeout(() => this.loading = false, 500); // убрать
  }
  openDialog(editableTodo?: Todo): void {
    const dialogRef = this.dialog.open(CreateTodo, {
      width: '500px',
      data: editableTodo
    });

    dialogRef.afterClosed().subscribe((result: TodoCreate | undefined) => {
      if (result) {
          // Создание новой задачи
          this.taskService.createTask(result);
      }
    });
  }
}
// todo заменить много async на 1 подписку
