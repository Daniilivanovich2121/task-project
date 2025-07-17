import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TaskService} from '../../Services/task.Service';
import {TodoCard} from '../todo-card/todo-card';
import {AsyncPipe, CommonModule} from '@angular/common';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    TodoCard,
    AsyncPipe
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

}
