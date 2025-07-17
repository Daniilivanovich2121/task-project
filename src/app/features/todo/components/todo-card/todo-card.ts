import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Todo} from '../../models/todo.model';

@Component({
  selector: 'app-todo-card',
  imports: [],
  templateUrl: './todo-card.html',
  styleUrl: './todo-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCard {
  @Input() task!: Todo;


}
