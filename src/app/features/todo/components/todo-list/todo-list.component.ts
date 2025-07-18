import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TaskService} from '../../Services/task.Service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {TodoCardComponent} from '../todo-card/todo-card.component';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CdkDropList} from '@angular/cdk/drag-drop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Todo} from '../../models/todo.model';
import {map, Observable} from 'rxjs';


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

  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  public readonly taskService = inject(TaskService);
  public readonly tasks$: Observable<Todo[]> = this.taskService.todos$;


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
