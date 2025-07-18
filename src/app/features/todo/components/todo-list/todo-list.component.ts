import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TaskService} from '../../Services/task.Service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {TodoCardComponent} from '../todo-card/todo-card.component';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CdkDropList} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    TodoCardComponent,
    AsyncPipe,
    MatIcon,
    MatButton,
    CdkDropList
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit{
  public readonly taskService = inject(TaskService);
  public readonly tasks$ = this.taskService.todos$;

  ngOnInit() {
    this.taskService.getTask()
  }

  protected readonly length = length;
}
