import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {Todo} from '../../models/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent {
  @Input() task!: Todo;
  @Output() taskDelete = new EventEmitter<Todo>();
  @Output()taskEdit = new EventEmitter<Todo>();
  @Output() taskToggleComplete = new EventEmitter<Todo>();

  onDelete(task:Todo):void {
    this.taskDelete.emit(task);
  }
  onEdit(task: Todo): void{
    this.taskEdit.emit(task);
  }
}
