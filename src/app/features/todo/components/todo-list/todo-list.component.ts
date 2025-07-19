import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../Services/task.Service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Todo } from '../../models/todo.model';
import { map, Observable, tap } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    TodoCardComponent,
    AsyncPipe,
    MatIcon,
    MatButton,
    CdkDropList,
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

  public readonly tasks$: Observable<Todo[]> = this.taskService.todos$.pipe(
    tap(() => this.loading = false) // Когда данные получены, устанавливаем loading в false
  );

  public readonly incompleteTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => !task.completed))
  );

  public readonly completedTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.completed))
  );

  ngOnInit() {
    this.taskService.getTask()
  }
}
